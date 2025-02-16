import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // Import ConfigModule
    TypeOrmModule.forFeature([User]), // Import TypeORM repository for User
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}