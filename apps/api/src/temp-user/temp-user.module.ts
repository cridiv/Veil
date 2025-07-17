import { Module } from '@nestjs/common';
import { TempUserService } from './temp-user.service';
import { TempUserController } from './temp-user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RoomModule } from 'src/room/room.module';
import { AuthService } from 'src/auth/auth.service';
import { TempUserStoreService } from './redis-store/temp-user-store.service';

@Module({
  imports: [RoomModule, AuthModule ],
  providers: [TempUserService, AuthService, TempUserStoreService ],
  controllers: [TempUserController]
})
export class TempUserModule {}
