import { Injectable } from '@nestjs/common'
import { MonoEventInterface } from './models'
import { MonoEventsRepository } from './mono-events.repository'

@Injectable()
export class MonoEventsService {
  constructor(private readonly repo: MonoEventsRepository) {}
  public async setMonoEvent(event: MonoEventInterface) {
    await this.repo.create(event)
  }

  public async getEvents() {
    return this.repo.events()
  }
}
