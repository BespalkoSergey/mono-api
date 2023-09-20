import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegrafModule } from 'nestjs-telegraf'
import { options } from './telegram.config'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule, TelegrafModule.forRootAsync(options())],
  providers: [TelegramService],
  exports: [TelegramService]
})
export class TelegramModule {}
