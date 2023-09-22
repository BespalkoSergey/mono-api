import { Injectable } from '@nestjs/common'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { ConfigService } from '@nestjs/config'
import { filter, from, map, shareReplay, switchMap, takeWhile, lastValueFrom } from 'rxjs'
import { Observable } from 'rxjs'
import { StickerSet, Sticker } from '@telegraf/types/message'
import { CONFIG_KEYS, TG_STICKER_SET_NAME } from '../../constants/constants'

@Injectable()
export class TelegramService {
  private readonly channelId = String(this.config.get(CONFIG_KEYS.TELEGRAM_CHANNEL_ID))
  private readonly stickers$: Observable<StickerSet> = from(this.bot.telegram.getStickerSet(TG_STICKER_SET_NAME)).pipe(shareReplay(1))
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly config: ConfigService
  ) {}

  public async log(instance: string, message: string, msgFromNewLine = true): Promise<void> {
    const text = `<b>[MONO-API ${instance}]</b>${msgFromNewLine ? '\n' : '  '}${message}`
    await this.bot.telegram.sendMessage(this.channelId, text, { disable_notification: true, parse_mode: 'HTML' })
  }

  public async sendSticker(emoji: string): Promise<void> {
    await lastValueFrom(
      this.stickers$.pipe(
        map(list => list.stickers.find(s => s.emoji === emoji)),
        takeWhile(s => !!s),
        filter((c: unknown): c is Sticker => !!c),
        switchMap(s => from(this.bot.telegram.sendSticker(this.channelId, s.file_id, { disable_notification: true })))
      )
    )
  }
}
