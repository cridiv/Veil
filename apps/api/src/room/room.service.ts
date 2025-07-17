import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
    async findRoomBySlug(slug: string): Promise<any> {
        if ( slug !== 'test-room') {
            return null;
        }

        return {
            id: 'room-123',
            slug: 'test-room',
            title: 'Testing Room'
        }
    }
    
}