import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
    async findRoomBySlug(slug: string): Promise<any> {}
}