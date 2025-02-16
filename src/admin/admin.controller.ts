import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TelegramService } from '../telegram/telegram.service';

@Controller('admin')
export class AdminController {
  constructor(private telegramService: TelegramService) {}

  @Get('login')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req) {
    return req.user;
  }

  @Post('block-user')
  @UseGuards(AuthGuard('google'))
  async blockUser(@Body('userId') userId: number) {
    await this.telegramService.blockUser(userId);
    return { message: 'User blocked successfully' };
  }

  @Post('delete-user')
  @UseGuards(AuthGuard('google'))
  async deleteUser(@Body('userId') userId: number) {
    await this.telegramService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }
}