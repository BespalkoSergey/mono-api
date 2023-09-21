import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database.service'
import { RawMonoEvent } from '../../models/models'
import { MonoEventTypeEnum, MonoEventStatementItem, MonoUnknownEvent, Prisma } from '@prisma/client'
import { TelegramService } from '../../telegram/telegram.service'
import { getGrn, getIsPosMoneyOperation, getMoneyOperationEmoji } from '../../../utils/utils'
import { STICKERS_MAP, UNKNOWN_EMOJI } from '../../../constants/constants'

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

        await this.telegram.log(
          'MonoEventsRepository',
          [
            `Description: <tg-spoiler>${description}</tg-spoiler>`,
            `Operation: ${getMoneyOperationEmoji(operationAmount)} ${getGrn(operationAmount)}`
          ].join('\n')
        )
        this.telegram.sendSticker(
          getIsPosMoneyOperation(operationAmount) ? STICKERS_MAP.IS_POSITIVE_OPERATION_AMOUNT : STICKERS_MAP.NOT_POSITIVE_OPERATION_AMOUNT
        )
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

      await this.telegram.log('MonoEventsRepository', `Unknown event: ${event?.['type']} ${UNKNOWN_EMOJI}`)
      this.telegram.sendSticker(STICKERS_MAP.UNKNOWN_OPERATION)
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
      await this.telegram.log('MonoEventsRepository', text)
      this.telegram.sendSticker(STICKERS_MAP.ERROR_IN_OPERATION)
      return null
    }
  }

  private isMonoRootEventStatementItem(c: unknown): c is RawMonoEvent {
    return (c as RawMonoEvent)?.type === MonoEventTypeEnum.StatementItem
  }
}
