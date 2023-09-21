import { Injectable } from '@nestjs/common'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TelegramService {
  private readonly channelId = String(this.config.get('TELEGRAM_CHANNEL_ID'))
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly config: ConfigService
  ) {}

  public async log(instance: string, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(this.channelId, `[MONO-API ${instance}] ${message}`)
  }
}
