module.exports = {
  FangchaAuth: {
    mysql: {
      ssoDB: {
        host: 'host.docker.internal',
      },
    },
    ssoResque: {
      redisHost: 'host.docker.internal',
    },
    redisCache: {
      host: 'host.docker.internal',
    },
  },
}
