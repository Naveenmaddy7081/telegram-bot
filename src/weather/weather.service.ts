import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getWeather(city: string) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENWEATHER_API_KEY is not defined in the environment variables.');
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }
}