import { FCDatabase } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'
import { SsoConfig } from '../SsoConfig'

FCDatabase.instanceWithName('ssoDB').init(new DBOptionsBuilder(SsoConfig.mysql.ssoDB).build())

export const MyDatabase = {
  ssoDB: FCDatabase.instanceWithName('ssoDB'),
}
