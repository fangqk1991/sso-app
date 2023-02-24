import { AxiosBuilder } from '@fangcha/app-request'
import { ErrorModel } from '@fangcha/app-error'

interface ClassOptions {
  loginUrl?: string
  alertHandler?: (errMsg: string) => void
  errorMsgParser?: (responseData: any) => string
}

export class RequestFactory {
  private _options: Required<ClassOptions> = {
    loginUrl: '/api/v1/login',
    alertHandler: () => {},
    errorMsgParser: (responseData: any) => {
      let errMessage = responseData?.phrase
      if (!errMessage) {
        errMessage = typeof responseData === 'string' ? responseData : 'Unknown error'
      }
      return errMessage
    },
  }

  constructor(options: Partial<ClassOptions> = {}) {
    Object.assign(this._options, options)
  }

  public updateOptions(options: Partial<ClassOptions>) {
    Object.assign(this._options, options)
  }

  public makeClass(): typeof AxiosBuilder & { new (): AxiosBuilder } {
    const options = this._options

    return class HttpRequest extends AxiosBuilder {
      useRedirecting = true

      protected _mute: boolean = false
      public setMute(mute: boolean) {
        this._mute = mute
      }

      constructor() {
        super()
        this.addHeader('x-requested-with', 'XMLHttpRequest')
        this.setErrorHandler((err) => {
          const responseData = this.axiosResponse?.data as ErrorModel
          switch (err.statusCode) {
            case 401: {
              if (this.useRedirecting) {
                if (options.loginUrl !== window.location.pathname) {
                  window.location.href = `${options.loginUrl}?redirectUri=${encodeURIComponent(window.location.href)}`
                }
                return
              }
              break
            }
            default: {
              break
            }
          }
          const errMessage = options.errorMsgParser(responseData)
          if (!this._mute) {
            options.alertHandler(errMessage)
          }
          throw err
        })
      }
    }
  }
}
