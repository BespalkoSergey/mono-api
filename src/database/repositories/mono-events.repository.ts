import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database.service'
import { RawMonoEvent } from '../../models/models'
import { MonoEventTypeEnum, MonoEventStatementItem, MonoUnknownEvent, Prisma } from '@prisma/client'
import { MonoLoggerService } from '../services/mono-logger.service'

@Injectable()
export class MonoEventsRepository {
  private readonly unknownEvents = this.__db.monoUnknownEvent
  private readonly statementItems = this.__db.monoEventStatementItem
  constructor(
    private readonly __db: DatabaseService,
    private readonly logger: MonoLoggerService
  ) {}

  public async create(event: RawMonoEvent): Promise<MonoEventStatementItem | MonoUnknownEvent | null> {
    try {
      if (this.isMonoRootEventStatementItem(event)) {
        const data = this.getMonoEventStatementItemCreateInput(event)
        this.logger.onCreateMonoRootEventStatementItem(data.description, data.operationAmount)
        return await this.statementItems.create({ data })
      }

      this.logger.onCreateMonoUnknownEvent(event?.['type'])
      return this.unknownEvents.create({ data: { event: JSON.stringify(event) } })
    } catch (e) {
      let text = 'Unknown prisma error'
      if (
        e instanceof Prisma.PrismaClientKnownRequestError ||
        e instanceof Prisma.PrismaClientValidationError ||
        e instanceof Prisma.PrismaClientUnknownRequestError
      ) {
        text = e.message
      }

      this.logger.onErrorInOperation(text)
      return null
    }
  }

  private isMonoRootEventStatementItem(c: unknown): c is RawMonoEvent {
    return (c as RawMonoEvent)?.type === MonoEventTypeEnum.StatementItem
  }

  private getMonoEventStatementItemCreateInput(event: RawMonoEvent): Prisma.MonoEventStatementItemCreateInput {
    const { account = '', statementItem } = event?.data ?? {}
    return {
      type: MonoEventTypeEnum.StatementItem,
      monoId: statementItem?.id ?? '',
      account,
      mcc: statementItem?.mcc ?? 0,
      hold: statementItem?.hold ?? false,
      time: statementItem?.time ?? 0,
      amount: statementItem?.amount ?? 0,
      balance: statementItem?.balance ?? 0,
      receiptId: statementItem?.receiptId ?? '',
      description: statementItem?.description ?? '',
      originalMcc: statementItem?.originalMcc ?? 0,
      currencyCode: statementItem?.currencyCode ?? 0,
      cashbackAmount: statementItem?.cashbackAmount ?? 0,
      commissionRate: statementItem?.commissionRate ?? 0,
      operationAmount: statementItem?.operationAmount ?? 0
    }
  }
}
