const getParameterByName = (name: string, url = window.location.href) => {
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export class RedirectTools {
  public loginPagePath = '/login'
  public signupPagePath = '/signup'
  public defaultRedirectUri = '/profile'

  public checkLogin: () => boolean = () => false

  public redirectUri() {
    let redirectUri = getParameterByName('redirectUri') || ''
    if (!redirectUri.startsWith(window.location.origin)) {
      redirectUri = ''
    }
    return redirectUri || this.defaultRedirectUri
  }

  public async onLoginSuccess() {
    this.redirectIfNeed()
  }

  public redirectIfNeed() {
    const loginPathMap = {
      [this.loginPagePath]: true,
      [this.signupPagePath]: true,
    }
    const inLoginPage = loginPathMap[window.location.pathname]
    if (this.checkLogin()) {
      if (inLoginPage) {
        window.location.href = this.redirectUri()
      }
    } else {
      if (window.location.pathname === '/') {
        window.location.href = this.loginPagePath
      } else if (!inLoginPage) {
        window.location.href = `${this.loginPagePath}?redirectUri=${encodeURIComponent(window.location.href)}`
      }
    }
  }
}
