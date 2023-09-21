import { ConfigKeysType, DbStatusEmojiUnion, StickersEmojiUnion } from '../src/models/models'

export const DOMAIN = 'https://mb.my-space.org.ua'
export const API_ROUTE = '/api/mono/system/events'
export const SYSTEM_EVENTS_API = DOMAIN + API_ROUTE
export const MONO_PERSONAL_CLIENT_ROUTE = 'https://api.monobank.ua/personal'
export const MONO_PERSONAL_CLIENT_INFO_API = MONO_PERSONAL_CLIENT_ROUTE + '/client-info'
export const MONO_PERSONAL_CLIENT_WEBHOOK_API = MONO_PERSONAL_CLIENT_ROUTE + '/webhook'
export const MONO_PERSONAL_CLIENT_INFO_CHECK_INTERVAL = 1000 * 60 * 15 // 15 min
export const MONEY_OPERATION_TG_EMOJI_MAP: Record<string, string> = {
  '-1': '😡💸',
  '0': '😅❓',
  '1': '😄💰'
}

export const DB_STATUS_TG_EMOJI_MAP: Record<DbStatusEmojiUnion, string> = {
  connected: '🟢',
  disconnected: '🔴'
}

export const STICKERS_MAP: Record<StickersEmojiUnion, string> = {
  CREPT_UP_TO_THE_BLINDS: '1f9e5281-27fe-48ec-82cc-0083c998448f'
}

export const TG_STICKER_SET_NAME = 'TheOfficeSP'

export const CONFIG_KEYS: ConfigKeysType = {
  PORT: 'PORT',
  HOSTNAME: 'HOSTNAME',
  CORS_ORIGIN: 'CORS_ORIGIN',
  CLIENT_INFO_X_TOKEN: 'CLIENT_INFO_X_TOKEN',
  GIT_COMMIT: 'GIT_COMMIT',
  TELEGRAM_BOT_TOKEN: 'TELEGRAM_BOT_TOKEN',
  TELEGRAM_CHANNEL_ID: 'TELEGRAM_CHANNEL_ID'
}
