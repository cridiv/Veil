import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { RoomModule } from './room/room.module';
import { TempUserModule } from './temp-user/temp-user.module';
import { QuestionModule } from './question/question.module';
import { PollModule } from './poll/poll.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    RedisModule,
    RoomModule,
    TempUserModule,
    QuestionModule,
    PollModule,
    WebsocketModule,
  ],
})
export class AppModule {}
