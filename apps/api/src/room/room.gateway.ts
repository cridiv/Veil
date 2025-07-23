import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { QuestionStoreService } from './question-store.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly questionStore: QuestionStoreService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // 👥 When a user joins a room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    console.log(`${data.userId} joined room: ${data.roomId}`);
  }

  // ❓ When a user asks a question
  @SubscribeMessage('askQuestion')
  handleAskQuestion(
    @MessageBody()
    data: { roomId: string; userId: string; question: string },
  ) {
    const newQuestion = {
      id: uuidv4(),
      userId: data.userId,
      roomId: data.roomId,
      question: data.question,
      timestamp: Date.now(),
    };

    this.questionStore.addQuestion(data.roomId, newQuestion);

    // 📢 Broadcast to room
    this.server.to(data.roomId).emit('newQuestion', newQuestion);
  }

  // ✅ When a moderator replies
  @SubscribeMessage('replyToQuestion')
  handleReplyToQuestion(
    @MessageBody()
    data: { roomId: string; questionId: string; answer: string },
  ) {
    const updated = this.questionStore.answerQuestion(
      data.roomId,
      data.questionId,
      data.answer,
    );

    if (updated) {
      // 📢 Broadcast update to room
      this.server.to(data.roomId).emit('questionReplied', updated);
    }
  }

  // 🧾 Optional: Fetch all questions (on room load)
  @SubscribeMessage('getQuestions')
  handleGetQuestions(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const questions = this.questionStore.getQuestions(roomId);
    client.emit('questionsList', questions);
  }

    @SubscribeMessage('upvoteQuestion')
  handleUpvoteQuestion(
    @MessageBody() data: { roomId: string; questionId: string },
  ) {
    const updated = this.questionStore.upvoteQuestion(data.roomId, data.questionId);
    if (updated) {
      this.server.to(data.roomId).emit('questionUpdated', updated);
    }
  }

  @SubscribeMessage('toggleAnswered')
  handleToggleAnswered(
    @MessageBody() data: { roomId: string; questionId: string },
  ) {
    const updated = this.questionStore.toggleAnswered(data.roomId, data.questionId);
    if (updated) {
      this.server.to(data.roomId).emit('questionUpdated', updated);
    }
  }

  @SubscribeMessage('toggleHidden')
  handleToggleHidden(
    @MessageBody() data: { roomId: string; questionId: string },
  ) {
    const updated = this.questionStore.toggleHidden(data.roomId, data.questionId);
    if (updated) {
      this.server.to(data.roomId).emit('questionUpdated', updated);
    }
  }

  @SubscribeMessage('deleteQuestion')
  handleDeleteQuestion(
    @MessageBody() data: { roomId: string; questionId: string },
  ) {
    const deleted = this.questionStore.deleteQuestion(data.roomId, data.questionId);
    if (deleted) {
      this.server.to(data.roomId).emit('questionDeleted', data.questionId);
    }
  }
}
