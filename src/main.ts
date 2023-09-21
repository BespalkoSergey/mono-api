import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { CONFIG_KEYS } from '../constants/constants'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.disable('x-powered-by')
  app.enableShutdownHooks()
  const config: ConfigService = app.get(ConfigService)
  await app.listen(Number(config.get(CONFIG_KEYS.PORT)), String(config.get(CONFIG_KEYS.HOSTNAME)), () => {
    const logger = new Logger(CONFIG_KEYS.GIT_COMMIT)
    logger.log(config.get(CONFIG_KEYS.GIT_COMMIT))
  })
}
bootstrap()
