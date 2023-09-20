import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf'
import { ConfigModule, ConfigService } from '@nestjs/config'

export const options = (): TelegrafModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    token: String(config.get('TELEGRAM_API_TOKEN'))
  })
})
