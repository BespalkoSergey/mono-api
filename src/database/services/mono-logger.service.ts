import { Injectable } from '@nestjs/common'
import { getGrn, getIsPosMoneyOperation, getMoneyOperationEmoji } from '../../../utils/utils'
import { STICKERS_MAP, UNKNOWN_EMOJI } from '../../../constants/constants'
import { TelegramService } from '../../telegram/telegram.service'

@Injectable()
export class MonoLoggerService {
  constructor(private readonly telegram: TelegramService) {}

  public async onCreateMonoRootEventStatementItem(description: string, operationAmount: number): Promise<void> {
    await this.telegram.log(
      'MonoEventsRepository',
      [
        `Description: <tg-spoiler>${description}</tg-spoiler>`,
        `Operation: ${getMoneyOperationEmoji(operationAmount)} ${getGrn(operationAmount)}`
      ].join('\n')
    )

    await this.telegram.sendSticker(
      getIsPosMoneyOperation(operationAmount) ? STICKERS_MAP.IS_POSITIVE_OPERATION_AMOUNT : STICKERS_MAP.NOT_POSITIVE_OPERATION_AMOUNT
    )
  }

  public async onCreateMonoUnknownEvent(type?: string): Promise<void> {
    await this.telegram.log('MonoEventsRepository', `Unknown event: ${type} ${UNKNOWN_EMOJI}`)
    await this.telegram.sendSticker(STICKERS_MAP.UNKNOWN_OPERATION)
  }

  public async onErrorInOperation(text: string): Promise<void> {
    await this.telegram.log('MonoEventsRepository', text)
    await this.telegram.sendSticker(STICKERS_MAP.ERROR_IN_OPERATION)
  }
}
