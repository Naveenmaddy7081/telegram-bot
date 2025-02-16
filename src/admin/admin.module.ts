import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [TelegramModule], // Import TelegramModule
  controllers: [AdminController],
})
export class AdminModule {}