import { FCDatabase } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'
import { AuthConfig } from '../AuthConfig'

FCDatabase.instanceWithName('ssoDB').init(new DBOptionsBuilder(AuthConfig.mysql.ssoDB).build())

export const MyDatabase = {
  ssoDB: FCDatabase.instanceWithName('ssoDB'),
}
