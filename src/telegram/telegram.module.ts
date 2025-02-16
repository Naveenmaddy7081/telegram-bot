import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribedUser } from './subscribed-user.entity';
import { WeatherService } from '../weather/weather.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([SubscribedUser]), // Register the repository
    WeatherModule,
  ],
  providers: [TelegramService],
  exports: [TelegramService], // Export TelegramService
})
export class TelegramModule {}