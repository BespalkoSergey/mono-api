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

export type DbStatusEmojiUnion = 'CONNECTED' | 'DISCONNECTED'

export type StickersEmojiUnion = 'CREPT_UP_TO_THE_BLINDS'

type CustomEnumType<ValuesUnion extends string> = {
  [K in ValuesUnion]: K
}

type ConfigKeysUnion =
  | 'PORT'
  | 'HOSTNAME'
  | 'CORS_ORIGIN'
  | 'CLIENT_INFO_X_TOKEN'
  | 'GIT_COMMIT'
  | 'TELEGRAM_BOT_TOKEN'
  | 'TELEGRAM_CHANNEL_ID'
export type ConfigKeysType = CustomEnumType<ConfigKeysUnion>
