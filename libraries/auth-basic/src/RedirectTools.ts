const getParameterByName = (name: string, url = window.location.href) => {
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

interface Options {
  checkLogin: () => boolean
  loginPagePath?: string
  signupPagePath?: string
  defaultRedirectUri?: string
}

export class RedirectTools {
  private _options: Required<Options> = {
    loginPagePath: '/login',
    signupPagePath: '/signup',
    defaultRedirectUri: '/profile',
    checkLogin: () => false,
  }

  public constructor(options: Options) {
    Object.assign(this._options, options)
  }

  public redirectUri() {
    let redirectUri = getParameterByName('redirectUri') || ''
    if (!redirectUri.startsWith(window.location.origin)) {
      redirectUri = ''
    }
    return redirectUri || this._options.defaultRedirectUri
  }

  public async onLoginSuccess() {
    this.redirectIfNeed()
  }

  public redirectIfNeed() {
    const loginPathMap = {
      [this._options.loginPagePath]: true,
      [this._options.signupPagePath]: true,
    }
    const inLoginPage = loginPathMap[window.location.pathname]
    if (this._options.checkLogin()) {
      if (inLoginPage) {
        window.location.href = this.redirectUri()
      }
    } else {
      if (window.location.pathname === '/') {
        window.location.href = this._options.loginPagePath
      } else if (!inLoginPage) {
        window.location.href = `${this._options.loginPagePath}?redirectUri=${encodeURIComponent(window.location.href)}`
      }
    }
  }
}
