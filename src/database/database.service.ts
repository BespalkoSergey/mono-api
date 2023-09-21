import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { TelegramService } from '../telegram/telegram.service'
import { DB_STATUS_TG_EMOJI_MAP } from '../../constants/constants'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly telegram: TelegramService) {
    super()
  }
  public async onModuleInit(): Promise<void> {
    await this.$connect()
    await this.telegram.log('PrismaClient', DB_STATUS_TG_EMOJI_MAP.CONNECTED, false)
  }
  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
    await this.telegram.log('PrismaClient', DB_STATUS_TG_EMOJI_MAP.DISCONNECTED, false)
  }
}
