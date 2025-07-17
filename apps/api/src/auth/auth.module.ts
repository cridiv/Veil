import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoomModule } from 'src/room/room.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  imports: [RoomModule, JwtModule],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
