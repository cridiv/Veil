import { Module } from '@nestjs/common';
import { TempUserService } from './temp-user.service';
import { TempUserController } from './temp-user.controller';

@Module({
  providers: [TempUserService],
  controllers: [TempUserController]
})
export class TempUserModule {}
