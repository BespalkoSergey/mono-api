import { Injectable } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { RawMonoEvent } from './models'
import { MonoEventTypeEnum } from '@prisma/client'

@Injectable()
export class MonoEventsRepository {
  private readonly unknownEvents = this.__db.monoUnknownEvent
  private readonly statementItems = this.__db.monoEventStatementItem
  constructor(private readonly __db: DatabaseService) {}

  public async create(event: RawMonoEvent) {
    try {
      if (this.isMonoRootEventStatementItem(event)) {
        const { account = '', statementItem } = event?.data ?? {}
        const {
          id = '',
          mcc = 0,
          hold = false,
          time = 0,
          amount = 0,
          balance = 0,
          receiptId = '',
          description = '',
          originalMcc = 0,
          currencyCode = 0,
          cashbackAmount = 0,
          commissionRate = 0,
          operationAmount = 0
        } = statementItem ?? {}

        return await this.statementItems.create({
          data: {
            type: MonoEventTypeEnum.StatementItem,
            account,
            monoId: id,
            mcc,
            hold,
            time,
            amount,
            balance,
            receiptId,
            description,
            originalMcc,
            currencyCode,
            cashbackAmount,
            commissionRate,
            operationAmount
          }
        })
      }

      return await this.unknownEvents.create({ data: { event: JSON.stringify(event) } })
    } catch {
      return null
    }
  }

  private isMonoRootEventStatementItem(c: unknown): c is RawMonoEvent {
    return (c as RawMonoEvent)?.type === MonoEventTypeEnum.StatementItem
  }
}
