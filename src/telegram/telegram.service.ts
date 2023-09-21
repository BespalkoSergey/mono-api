import { Injectable } from '@nestjs/common'
import { InjectBot } from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { ConfigService } from '@nestjs/config'
import { filter, from, map, shareReplay, switchMap, takeWhile } from 'rxjs'
import { Observable } from 'rxjs'
import { StickerSet, Sticker } from '@telegraf/types/message'
import { StickersEmojiUnion } from '../models/models'
import { CONFIG_KEYS, TG_STICKER_SET_NAME } from '../../constants/constants'

@Injectable()
export class TelegramService {
  private readonly channelId = String(this.config.get(CONFIG_KEYS.TELEGRAM_CHANNEL_ID))
  private readonly stickers$: Observable<StickerSet> = from(this.bot.telegram.getStickerSet(TG_STICKER_SET_NAME)).pipe(shareReplay(1))
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly config: ConfigService
  ) {}

  public async log(instance: string, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(this.channelId, `<b>[MONO-API ${instance}]</b>\n${message}`, { disable_notification: true, parse_mode: 'HTML' })
  }

  public sendSticker(emoji: StickersEmojiUnion): void {
    this.stickers$
      .pipe(
        map(list => list.stickers.find(s => s.emoji === emoji)),
        takeWhile(s => !!s),
        filter((c: unknown): c is Sticker => !!c),
        switchMap(s => from(this.bot.telegram.sendSticker(this.channelId, s.file_unique_id)))
      )
      .subscribe()
  }
}
