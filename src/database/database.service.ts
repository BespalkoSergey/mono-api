import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { TelegramService } from '../telegram/telegram.service'
import { DB_STATUS_TG_EMOJI_MAP } from '../../constants/constants'
import { DbStatusEmojiUnion } from '../models/models'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly telegram: TelegramService) {
    super()
  }
  public async onModuleInit(): Promise<void> {
    await this.$connect()
    await this.telegram.log('PrismaClient', this.getTelegramText('connected'))
  }
  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
    await this.telegram.log('PrismaClient', this.getTelegramText('disconnected'))
  }

  private getTelegramText(dbStatus: DbStatusEmojiUnion): string {
    return `Database is ${DB_STATUS_TG_EMOJI_MAP[dbStatus]}`
  }
}
