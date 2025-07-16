import { Controller, Post, Body, Param } from '@nestjs/common';
import { JoinRoomDto } from './dto/join-room.dto';


@Controller('temp-user')
export class TempUserController {

    @Post('room/:slug/users')
    async joinRoom(
        @Param('slug') slug: string,
        @Body() joinRoomDto: JoinRoomDto
    ) {
              console.log (`User ${joinRoomDto.username} is joining room ${slug}`);
              return { message: 'Received' };
          }
    }
