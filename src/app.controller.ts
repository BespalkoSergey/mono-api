import { Body, Controller, Get, HttpStatus, Post, Response } from '@nestjs/common'
import { MonoEventsService } from './mono-events.service'
import { Response as ExpressResponse } from 'express'
import { API_ROUTE } from '../constants/constants'
import { MonoEventInterface } from './models'

@Controller()
export class AppController {
  constructor(private readonly mono: MonoEventsService) {}

  @Get(API_ROUTE)
  public getMonoSystemCheck(@Response() res: ExpressResponse): void {
    res.status(HttpStatus.OK).send()
  }

  @Post(API_ROUTE)
  public setMonoSystemEvent(@Body() body: MonoEventInterface, @Response() res: ExpressResponse): void {
    res.status(HttpStatus.OK).send()
    this.mono.setMonoEvent(body)
  }
}
