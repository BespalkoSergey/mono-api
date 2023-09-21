import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CONFIG_KEYS } from '../../constants/constants'

export const options = (): TelegrafModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    token: String(config.get(CONFIG_KEYS.TELEGRAM_BOT_TOKEN))
  })
})
