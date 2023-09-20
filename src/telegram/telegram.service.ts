import { Injectable } from '@nestjs/common'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly config: ConfigService
  ) {}

  public async send(message: string) {
    await this.bot.telegram.sendMessage(String(this.config.get('TELEGRAM_CHANNEL_ID')), message)
  }
}
