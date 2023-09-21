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
