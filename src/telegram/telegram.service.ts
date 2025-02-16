import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscribedUser } from './subscribed-user.entity';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(
    private configService: ConfigService,
    @InjectRepository(SubscribedUser)
    private userRepository: Repository<SubscribedUser>,
    private weatherService: WeatherService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in the environment variables.');
    }
    this.bot = new Telegraf(token);
    this.bot.start((ctx) => ctx.reply('Welcome! Use /subscribe <city> to get daily weather updates.'));
    this.bot.command('subscribe', (ctx) => this.subscribeUser(ctx));
    this.bot.launch();

    // Schedule daily weather updates
    this.sendDailyWeatherUpdates();
  }

  async subscribeUser(ctx: any) {
    const userId = ctx.from.id;
    const city = ctx.message.text.split(' ')[1]; // Extract city from command

    if (!city) {
      ctx.reply('Please provide a city name. Example: /subscribe London');
      return;
    }

    const user = await this.userRepository.findOne({ where: { userId } });

    if (user) {
      ctx.reply('You are already subscribed!');
    } else {
      const newUser = this.userRepository.create({ userId, city });
      await this.userRepository.save(newUser);
      ctx.reply(`You are now subscribed to daily weather updates for ${city}!`);
    }
  }

  async sendDailyWeatherUpdates() {
    const users = await this.userRepository.find();
    for (const user of users) {
      if (!user.blocked) { // Skip blocked users
        const weather = await this.weatherService.getWeather(user.city);
        const message = `Daily weather update for ${user.city}: ${weather.weather[0].description}, Temperature: ${weather.main.temp}°C`;
        this.bot.telegram.sendMessage(user.userId, message);
      }
    }
  }

  async blockUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (user) {
      user.blocked = true; // Set the blocked property to true
      await this.userRepository.save(user);
    }
  }

  async deleteUser(userId: number) {
    await this.userRepository.delete({ userId });
  }
}