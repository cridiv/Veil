import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { TempUserStoreService } from '../temp-user/redis-store/temp-user-store.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { QuestionStoreService } from './question-store.service';
import crypto from 'crypto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private roomService: RoomService,
    private tempUserStoreService: TempUserStoreService,
    private questionStoreService: QuestionStoreService
  ) {}
  
  server: Server;
  private socketUserMap = new Map<string, { userId: string; roomId: string }>();

  async handleConnection(client: Socket) {
    console.log(`Socket connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const userData = this.socketUserMap.get(client.id);
    if (userData) {
      await this.tempUserStoreService.deleteUser(userData.userId);
      this.socketUserMap.delete(client.id);

      client.to(userData.roomId).emit('userLeft', {
        userId: userData.userId,
      });

      console.log(`User ${userData.userId} disconnected and removed from room ${userData.roomId}`);
    } else {
      console.log(`Unknown socket disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      username: string;
      roomSlug: string;
    },
  ) {
    const { username, roomSlug } = payload;

    const room = await this.roomService.findRoomBySlug(roomSlug);
    if (!room) {
      client.emit('error', { message: 'Room not found' });
      return;
    }

    const userId = `${client.id}-${Date.now()}`;

    await this.tempUserStoreService.setUser(userId, {
      username,
      roomId: room.id,
    }, 3600);

    this.socketUserMap.set(client.id, { userId, roomId: room.id });

    client.join(room.id);

    client.to(room.id).emit('userJoined', {
      userId,
      username,
    });

    client.emit('joinedRoom', {
      userId,
      roomId: room.id,
      roomTitle: room.title,
    });

    console.log(`User ${username} joined room ${roomSlug}`);
  }

  @SubscribeMessage('ask_question')
async handleAskQuestion(
  @MessageBody() dto: AskQuestionDto,
  @ConnectedSocket() client: Socket,
) {
  const question = {
    id: crypto.randomUUID(),
    userId: dto.userId,
    roomId: dto.roomId,
    question: dto.question,
    timestamp: Date.now(),
  };

  this.questionStoreService.addQuestion(dto.roomId, question);

  this.server.to(dto.roomId).emit('new_question', question);
}

@SubscribeMessage('answer_question')
async handleAnswerQuestion(
  @MessageBody() dto: AnswerQuestionDto,
  @ConnectedSocket() client: Socket,
) {
  const room = await this.roomService.findRoomBySlug(dto.roomId);
  if (!room || room.moderatorId !== dto.moderatorId) {
    client.emit('error', { message: 'Unauthorized to answer question' });
    return;
  }

  const updated = this.questionStoreService.answerQuestion(dto.roomId, dto.questionId, dto.answer);

  if (!updated) {
    client.emit('error', { message: 'Question not found' });
    return;
  }

  this.server.to(dto.roomId).emit('question_answered', updated);
}

}
