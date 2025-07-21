import { Controller, Post, Body, Param, Get, Delete, BadRequestException } from '@nestjs/common';
import { JoinRoomDto } from './dto/join-room.dto';
import { TempUserService } from './temp-user.service';
import { TempUserStoreService } from './redis-store/temp-user-store.service';

@Controller('user')
export class TempUserController {
    constructor(private readonly tempUserService: TempUserService,
                private readonly tempUserStoreService: TempUserStoreService
    ) {}
    
    @Post('room/:slug/users')
    async joinRoom(
        @Param('slug') slug: string,
        @Body() joinRoomDto: JoinRoomDto
    ) {
            if (!slug) {
    throw new BadRequestException('Room slug is required');
  }
           return this.tempUserService.joinRoom(slug, joinRoomDto.username);
          }

    @Post('temp-user')
    async setUser(
        @Body()  joinRoomDto: JoinRoomDto
    ) {
        const result = await this.tempUserStoreService.setUser(joinRoomDto.username, joinRoomDto.roomId, joinRoomDto.ttl);
        return result
    }

    @Get('room/:userId')
    async getUser(
        @Param('userId') userId: string
    ) {
        const user = await this.tempUserStoreService.getUser(userId)
        return user
    }

    @Delete('room/logout/:userId')
    async deleteUser(
        @Param('userId') userId: string
    ) {
        const logout = await this.tempUserStoreService.deleteUser(userId);
        return logout
    }

    @Get('room/:roomId/list')
    async getRoomUsers(
        @Param('roomId') roomId: string
    ) {
        const list = await this.tempUserStoreService.getRoomUsers(roomId);
        return list
    }

    @Get('room/:roomId/no')
    async getRoomUserCount(
        @Param('roomId') roomId: string
    ) {
        const no = await this.tempUserStoreService.getRoomUserCount(roomId)
        return no
    }
    }
