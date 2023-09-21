import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database.service'
import { RawMonoEvent } from '../../models/models'
import { MonoEventTypeEnum, MonoEventStatementItem, MonoUnknownEvent } from '@prisma/client'
import { TelegramService } from '../../telegram/telegram.service'
import { getGrn, getMoneyOperationEmoji } from '../../../utils/utils'

@Injectable()
export class MonoEventsRepository {
  private readonly unknownEvents = this.__db.monoUnknownEvent
  private readonly statementItems = this.__db.monoEventStatementItem
  constructor(
    private readonly __db: DatabaseService,
    private readonly telegram: TelegramService
  ) {}

  public async create(event: RawMonoEvent): Promise<MonoEventStatementItem | MonoUnknownEvent | null> {
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

        const item = await this.statementItems.create({
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
        await this.telegram.log(
          'MonoEventsRepository',
          [
            `Description: <tg-spoiler>${item.description}</tg-spoiler>`,
            `Operation: ${getMoneyOperationEmoji(item.operationAmount)} ${getGrn(item.operationAmount)}`
          ].join('\n')
        )
        return item
      }

      const item = await this.unknownEvents.create({ data: { event: JSON.stringify(event) } })
      await this.telegram.log('MonoEventsRepository', `Unknown event: ${event?.['type'] ?? ''}`)
      return item
    } catch (e) {
      await this.telegram.log('MonoEventsRepository', `<pre>${JSON.stringify(e, null, 2)}</pre>`)
      return null
    }
  }

  private isMonoRootEventStatementItem(c: unknown): c is RawMonoEvent {
    return (c as RawMonoEvent)?.type === MonoEventTypeEnum.StatementItem
  }
}
