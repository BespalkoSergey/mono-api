import { MONEY_OPERATION_TG_EMOJI_MAP } from '../constants/constants'

export const isNotEmptyString = (c: unknown): c is string => typeof c === 'string' && !!c.trim()
export const getScreamingSnakeCase = (s: string): string =>
  s
    .split('')
    .map(c => {
      if (!isNotEmptyString(c)) {
        return '_'
      }
      return c.toUpperCase()
    })
    .join('')
export const getMoneyOperationEmoji = (n: number) => MONEY_OPERATION_TG_EMOJI_MAP[String(Math.sign(n))]
export const getGrn = (n: number) => Math.round(n / 100)
