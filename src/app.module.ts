import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from './telegram/telegram.module';
import { WeatherModule } from './weather/weather.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SubscribedUser } from './telegram/subscribed-user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [SubscribedUser],
      synchronize: true,
    }),
    TelegramModule,
    WeatherModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}