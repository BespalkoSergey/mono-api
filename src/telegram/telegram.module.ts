import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegrafModule } from 'nestjs-telegraf'
import { options } from './telegram.config'

@Module({
  imports: [TelegrafModule.forRootAsync(options())],
  providers: [TelegramService],
  exports: [TelegramService]
})
export class TelegramModule {}
