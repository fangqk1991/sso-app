import { makeUUID } from '@fangcha/tools'
import { RedisCache } from '@fangcha/tools/lib/redis'
import { SsoConfig } from '../../SsoConfig'

interface SimulateParams {
  operator: string
  accountUid: string
}

const SimulateExpireTime = 60

const _cache = new RedisCache(SsoConfig.redisCache)

export class SimulateStorage {
  private static redisKeyPartForSimulate(token: string) {
    return `sso.simulate:auth:${token}:entity`
  }

  public static async makeSimulateToken(params: SimulateParams) {
    const token = makeUUID()
    const keyPart = this.redisKeyPartForSimulate(token)
    await _cache.cache(keyPart, JSON.stringify(params), SimulateExpireTime)
    return token
  }

  public static async getSimulateParams(token: string): Promise<SimulateParams | null> {
    const keyPart = this.redisKeyPartForSimulate(token)
    const content = await _cache.get(keyPart)
    if (!content) return null
    return JSON.parse(content) as SimulateParams
  }

  public static async clearSimulateParams(token: string): Promise<void> {
    const keyPart = this.redisKeyPartForSimulate(token)
    await _cache.clear(keyPart)
  }
}
