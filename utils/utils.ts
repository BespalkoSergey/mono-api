export const isNotEmptyString = (c: unknown): c is string => typeof c === 'string' && !!c.trim()
