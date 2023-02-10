import { FCDatabase } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'
import { SsoAppConfig } from '../SsoConfig'

FCDatabase.instanceWithName('ssoDB').init(new DBOptionsBuilder(SsoAppConfig.mysql.ssoDB).build())

export const MyDatabase = {
  ssoDB: FCDatabase.instanceWithName('ssoDB'),
}
