import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as cors from 'cors'
import { API_ROUTE } from '../constants/constants'
import { MonoWebHookService } from './services/mono-web-hook.service'
import { HttpModule } from '@nestjs/axios'
import { DatabaseModule } from './database/database.module'
import { TelegramModule } from './telegram/telegram.module'

@Module({
  imports: [DatabaseModule, HttpModule, ConfigModule.forRoot(), TelegramModule],
  controllers: [AppController],
  providers: [MonoWebHookService]
})
export class AppModule implements NestModule {
  constructor(private readonly config: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: this.config.get<string>('CORS_ORIGIN'),
          methods: ['GET', 'POST'],
          allowedHeaders: ['Content-Type', 'Authorization'],
          credentials: true
        })
      )
      .forRoutes(API_ROUTE)
  }
}
