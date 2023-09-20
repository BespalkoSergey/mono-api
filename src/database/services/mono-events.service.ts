import { Injectable } from '@nestjs/common'
import { RawMonoEvent } from '../../models/models'
import { MonoEventsRepository } from '../repositories/mono-events.repository'

@Injectable()
export class MonoEventsService {
  constructor(private readonly repo: MonoEventsRepository) {}
  public async setMonoEvent(event: RawMonoEvent): Promise<void> {
    await this.repo.create(event)
  }
}
