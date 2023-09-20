import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { DatabaseService } from './database.service'
import { MonoEventsService } from './mono-events.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as cors from 'cors'
import { API_ROUTE } from '../constants/constants'
import { MonoWebHookService } from './mono-web-hook.service'
import { MonoEventsRepository } from './mono-events.repository'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [DatabaseService, MonoEventsService, MonoWebHookService, MonoEventsRepository]
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
