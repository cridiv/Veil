import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RoomService } from '../room/room.service';
import { AuthService } from '../auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { TempUserStoreService } from './redis-store/temp-user-store.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TempUserService {
  constructor(
    private readonly roomService: RoomService,
    private readonly authService: AuthService,
    private readonly tempUserStoreService: TempUserStoreService,
    private readonly jwtService: JwtService
  ) {}

  async joinRoom(slug: string, username: string) {
    const room = await this.roomService.findRoomBySlug(slug);
    if (!room) {
      throw new NotFoundException('Room Not Found');
    }

    const userId = uuidv4();

    const token = await this.authService.signJwt({
        sub: userId,
        username,
        roomId: room.id
    });

     await this.tempUserStoreService.setUser(userId, {
      username: username,
      roomId: room.id
     }, 3600);

     await this.tempUserStoreService.getUser(userId);

    return {
        user: {
            id: userId,
            username,
            roomId: room.id,
        },
        token,
    };
    }

    async getUserFromToken(token: string) {
      try{
        const payload = await this.jwtService.verifyAsync(token);
        return payload;
      } catch (err) {
         throw new UnauthorizedException('Invalid or Expired Token')
      }
    }
  }
