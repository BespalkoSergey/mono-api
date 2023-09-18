import { MonoEventTypeEnum } from '@prisma/client'

export type RawMonoEvent = {
  data: object
  type: MonoEventTypeEnum & string
  fromIp?: string
}
