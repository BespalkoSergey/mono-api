import { Injectable, Logger } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { RawMonoEvent } from './models'
import { MonoEventTypeEnum, MonoRootEvent } from '@prisma/client'

@Injectable()
export class MonoEventsRepository {
  private readonly lg = new Logger(MonoEventsRepository.name)
  private readonly unknownEvents = this.__db.monoUnknownEvent
  private readonly rootEvents = this.__db.monoRootEvent
  constructor(private readonly __db: DatabaseService) {}

  public async create(event: RawMonoEvent) {
    try {
      if (this.isMonoRootEventStatementItem(event)) {
        this.lg.log('isMonoRootEvent')
        return await this.rootEvents.create({ data: event })
      }

      this.lg.log('isNOT')
      return await this.unknownEvents.create({ data: { event } })
    } catch (e) {
      this.lg.log(e)
      return null
    }
  }

  private isMonoRootEventStatementItem(c: unknown): c is MonoRootEvent {
    return (c as MonoRootEvent)?.type === MonoEventTypeEnum.StatementItem
  }
}
