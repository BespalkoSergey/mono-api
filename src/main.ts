import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.disable('x-powered-by')
  app.enableShutdownHooks()
  const config: ConfigService = app.get(ConfigService)
  await app.listen(Number(config.get('PORT')), String(config.get('HOSTNAME')))
}
bootstrap()
