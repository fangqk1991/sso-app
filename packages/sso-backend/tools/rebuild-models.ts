import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { SafeTask } from '@fangcha/tools'
import { SsoConfig } from '../src/SsoConfig'

const modelTmpl = `${__dirname}/model.tmpl.ejs`
const extendTmpl = `${__dirname}/class.extends.model.ejs`

const generator = new ModelGenerator({
  dbConfig: SsoConfig.mysql.ssoDB,
  tmplFile: modelTmpl,
  extTmplFile: extendTmpl,
})

const generalDataSchemas: DBModelSchema[] = [
  {
    generator: generator,
    tableName: 'fc_app',
    outputFile: `${__dirname}/../src/models/auto-build/__App.ts`,
    extFile: `${__dirname}/../src/models/permission/_App.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_app_access',
    outputFile: `${__dirname}/../src/models/auto-build/__AppAccess.ts`,
    extFile: `${__dirname}/../src/models/permission/_AppAccess.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_group',
    outputFile: `${__dirname}/../src/models/auto-build/__Group.ts`,
    extFile: `${__dirname}/../src/models/permission/_Group.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_group_access',
    outputFile: `${__dirname}/../src/models/auto-build/__GroupAccess.ts`,
    extFile: `${__dirname}/../src/models/permission/_GroupAccess.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_group_member',
    outputFile: `${__dirname}/../src/models/auto-build/__GroupMember.ts`,
    extFile: `${__dirname}/../src/models/permission/_GroupMember.ts`,
    primaryKey: ['group_id', 'member'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['create_time'],
  },
  {
    generator: generator,
    tableName: 'fc_group_permission',
    outputFile: `${__dirname}/../src/models/auto-build/__GroupPermission.ts`,
    extFile: `${__dirname}/../src/models/permission/_GroupPermission.ts`,
    primaryKey: ['group_id', 'permission_key'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['group_id', 'permission_key', 'create_time'],
  },
]

SafeTask.run(async () => {
  for (const schema of generalDataSchemas) {
    const generator = schema.generator!
    const data = await generator.generateData(schema)
    generator.buildModel(schema, data)
  }
})
