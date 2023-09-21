import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { TelegramService } from '../telegram/telegram.service'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly telegram: TelegramService) {
    super()
  }
  public async onModuleInit(): Promise<void> {
    await this.$connect()
    await this.telegram.log('PrismaClient', 'Database  is connected')
  }
  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
    await this.telegram.log('PrismaClient', 'Database  is disconnected')
  }
}
