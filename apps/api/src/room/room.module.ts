import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, AuthenticatedGuard]
})
export class RoomModule {}
