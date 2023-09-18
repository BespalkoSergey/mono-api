import { Injectable } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { MonoEventInterface } from './models'

@Injectable()
export class MonoEventsRepository {
  private readonly _events = this.__db.monoEvent
  constructor(private readonly __db: DatabaseService) {}

  public async create(event: MonoEventInterface) {
    try {
      return await this._events.create({ data: { event } })
    } catch {
      return null
    }
  }

  public async events() {
    try {
      return await this._events.findMany()
    } catch {
      return []
    }
  }
}
