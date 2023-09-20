import { MonoEventTypeEnum } from '@prisma/client'
export type RawMonoEvent =
  | {
      data?: RawMonoEventData
      type?: MonoEventTypeEnum & string
      fromIp?: string
    }
  | undefined

export type RawMonoEventData =
  | {
      account?: string
      statementItem?: RawMonoEventStatementItem
    }
  | undefined

export type RawMonoEventStatementItem =
  | {
      id?: string
      mcc?: number
      hold?: boolean
      time?: number
      amount?: number
      balance?: number
      receiptId?: string
      description?: string
      originalMcc?: number
      currencyCode?: number
      cashbackAmount?: number
      commissionRate?: number
      operationAmount?: number
    }
  | undefined
