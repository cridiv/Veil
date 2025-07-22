import { Controller, Post, Body, Req, Get, UseGuards, Param } from '@nestjs/common';
import { Request } from 'express';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'


@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
async createRoom(@Req() req: Request, @Body() dto: CreateRoomDto) {
  const user = req.user as any;
  console.log('Moderator creating room:', user);

  return this.roomService.createRoom(dto, user.id);
}

@UseGuards(JwtAuthGuard)
@Get()
async getMyRooms(@Req() req: Request) {
  const user = req.user as any;
  return this.roomService.findRoomsByUserId(user.id);
}

@UseGuards(JwtAuthGuard)
@Get(':slug')
async getRoomBySlug(@Param('slug') slug: string) {
  return this.roomService.findRoomBySlug(slug);
}

  @Get('me')
  getMe(@Req() req) {
  return req.user;
}
}

