import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    console.log('Received webhook:', body); // Debug log
    const { message } = body;
    const chatId = message.chat.id;
    const text = message.text;
  
    if (text === '/subscribe') {
      await this.telegramService.subscribeUser(chatId);
      await this.telegramService.sendMessage(chatId, 'You have subscribed to daily weather updates.');
    } else {
      const weather = await this.telegramService.getWeather(text);
      await this.telegramService.sendMessage(chatId, JSON.stringify(weather));
    }
  }
}