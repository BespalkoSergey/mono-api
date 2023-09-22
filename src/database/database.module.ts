import { Module } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { MonoEventsRepository } from './repositories/mono-events.repository'
import { MonoEventsService } from './services/mono-events.service'
import { TelegramModule } from '../telegram/telegram.module'
import { MonoLoggerService } from './services/mono-logger.service'

@Module({
  imports: [TelegramModule],
  providers: [DatabaseService, MonoEventsRepository, MonoEventsService, MonoLoggerService],
  exports: [MonoEventsService]
})
export class DatabaseModule {}
