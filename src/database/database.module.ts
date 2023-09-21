import { Module } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { MonoEventsRepository } from './repositories/mono-events.repository'
import { MonoEventsService } from './services/mono-events.service'
import { TelegramModule } from '../telegram/telegram.module'

@Module({
  imports: [TelegramModule],
  providers: [DatabaseService, MonoEventsRepository, MonoEventsService],
  exports: [MonoEventsService]
})
export class DatabaseModule {}
