import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';


@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}
 @Post()
  async createRoom(@Body() dto: CreateRoomDto, @Req() req: Request & { user: { sub: string } }) {
    const moderatorId = req.user.sub;
    return this.roomService.createRoom(dto, moderatorId);
  }

  @Get('me')
  getMe(@Req() req) {
  return req.user;
}
}

