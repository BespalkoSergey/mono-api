import { Injectable } from '@nestjs/common'
import { RawMonoEvent } from './models'
import { MonoEventsRepository } from './mono-events.repository'

@Injectable()
export class MonoEventsService {
  constructor(private readonly repo: MonoEventsRepository) {}
  public async setMonoEvent(event: RawMonoEvent) {
    await this.repo.create(event)
  }
}
