import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { AxiosRequestConfig } from 'axios'
import {
  CONFIG_KEYS,
  MONO_PERSONAL_CLIENT_INFO_API,
  MONO_PERSONAL_CLIENT_INFO_CHECK_INTERVAL,
  MONO_PERSONAL_CLIENT_WEBHOOK_API,
  SYSTEM_EVENTS_API
} from '../../constants/constants'
import { getScreamingSnakeCase, isNotEmptyString } from '../../utils/utils'
import { filter, Subject, switchMap, takeUntil, tap, timer } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { TelegramService } from '../telegram/telegram.service'
@Injectable()
export class MonoWebHookService implements OnModuleInit, OnModuleDestroy {
  private readonly onInit$ = new Subject()
  private readonly onDestroy$ = new Subject()

  private readonly axiosConfig: AxiosRequestConfig<unknown> = {
    headers: { 'X-Token': this.config.get(CONFIG_KEYS.CLIENT_INFO_X_TOKEN) },
    responseType: 'json'
  }
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly telegram: TelegramService
  ) {
    this.checkWebHook()
  }

  public onModuleInit(): void {
    this.onInit$.next(null)
    this.onInit$.complete()
  }
  public onModuleDestroy(): void {
    this.onDestroy$.next(null)
    this.onDestroy$.complete()
  }

  private checkWebHook(): void {
    this.onInit$
      .pipe(
        switchMap(() => timer(0, MONO_PERSONAL_CLIENT_INFO_CHECK_INTERVAL)),
        switchMap(() => this.http.get(MONO_PERSONAL_CLIENT_INFO_API, this.axiosConfig)),
        filter(res => !isNotEmptyString(res?.data?.['webHookUrl'])),
        switchMap(() => this.http.post(MONO_PERSONAL_CLIENT_WEBHOOK_API, { webHookUrl: SYSTEM_EVENTS_API }, this.axiosConfig)),
        tap(res => {
          const isWebHookUrlSet = res?.data?.['status'] === 'ok'
          this.telegram.log('MonoWebHookService', `Webhook url was set ${getScreamingSnakeCase(isWebHookUrlSet.toString())}`)
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe()
  }
}
