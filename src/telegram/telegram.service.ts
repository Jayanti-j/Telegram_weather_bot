import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly botToken: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in the environment variables.');
    }
    this.botToken = token;
  }

  async sendMessage(chatId: string, text: string) {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    try {
      await axios.post(url, { chat_id: chatId, text });
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  async getWeather(city: string) {
    const apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY');
    if (!apiKey) {
      throw new Error('OPENWEATHERMAP_API_KEY is not defined in the environment variables.');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  async subscribeUser(chatId: string) {
    const existingUser = await this.userRepository.findOne({ where: { chatId } });
    if (existingUser) {
      throw new Error('User is already subscribed.');
    }

    const user = new User();
    user.chatId = chatId;
    await this.userRepository.save(user);
  }
}