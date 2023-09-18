import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import axios, { AxiosRequestConfig } from 'axios'
import { MONO_PERSONAL_CLIENT_INFO_API, MONO_PERSONAL_CLIENT_INFO_CHECK_INTERVAL, MONO_PERSONAL_CLIENT_WEBHOOK_API, SYSTEM_EVENTS_API } from '../constants/constants'
import { isNotEmptyString } from '../utils/utils'
import { filter, from, Subject, switchMap, takeUntil, timer } from 'rxjs'
import { ConfigService } from '@nestjs/config'
@Injectable()
export class MonoWebHookService implements OnModuleInit, OnModuleDestroy {
  private readonly onInit$ = new Subject()
  private readonly onDestroy$ = new Subject()

  private readonly axiosConfig: AxiosRequestConfig<unknown> = {
    headers: { 'X-Token': this.config.get('CLIENT_INFO_X_TOKEN') },
    responseType: 'json'
  }
  constructor(private readonly config: ConfigService) {
    // this.checkWebHook()
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
        switchMap(() => from(axios.get(MONO_PERSONAL_CLIENT_INFO_API, this.axiosConfig))),
        filter(res => !isNotEmptyString(res?.data?.['webHookUrl'])),
        switchMap(() => from(axios.post(MONO_PERSONAL_CLIENT_WEBHOOK_API, { webHookUrl: SYSTEM_EVENTS_API }, this.axiosConfig))),
        takeUntil(this.onDestroy$)
      )
      .subscribe()
  }
}
