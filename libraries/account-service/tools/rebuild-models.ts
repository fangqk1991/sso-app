import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { SafeTask } from '@fangcha/tools'
import { GlobalAppConfig } from 'fc-config'

const modelTmpl = `${__dirname}/model.tmpl.ejs`
const extendTmpl = `${__dirname}/class.extends.model.ejs`

const generator = new ModelGenerator({
  dbConfig: GlobalAppConfig.FangchaAuth.mysql.ssoDB,
  tmplFile: modelTmpl,
  extTmplFile: extendTmpl,
})

const generalDataSchemas: DBModelSchema[] = [
  {
    generator: generator,
    tableName: 'fc_account',
    outputFile: `${__dirname}/../src/models/auto-build/__Account.ts`,
    extFile: `${__dirname}/../src/models/account/_Account.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_account_carrier',
    outputFile: `${__dirname}/../src/models/auto-build/__AccountCarrier.ts`,
    extFile: `${__dirname}/../src/models/account/_AccountCarrier.ts`,
    primaryKey: ['carrier_type', 'account_uid'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_account_carrier_extras',
    outputFile: `${__dirname}/../src/models/auto-build/__AccountCarrierExtras.ts`,
    extFile: `${__dirname}/../src/models/account/_AccountCarrierExtras.ts`,
    primaryKey: ['carrier_uid', 'carrier_type'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_feishu_department',
    outputFile: `${__dirname}/../src/models/auto-build/__FeishuDepartment.ts`,
    extFile: `${__dirname}/../src/models/feishu/_FeishuDepartment.ts`,
    primaryKey: ['is_stash', 'open_department_id'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_feishu_user',
    outputFile: `${__dirname}/../src/models/auto-build/__FeishuUser.ts`,
    extFile: `${__dirname}/../src/models/feishu/_FeishuUser.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_feishu_department_member',
    outputFile: `${__dirname}/../src/models/auto-build/__FeishuDepartmentMember.ts`,
    extFile: `${__dirname}/../src/models/feishu/_FeishuDepartmentMember.ts`,
    primaryKey: ['is_stash', 'open_department_id', 'union_id'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
]

SafeTask.run(async () => {
  for (const schema of generalDataSchemas) {
    const generator = schema.generator!
    const data = await generator.generateData(schema)
    generator.buildModel(schema, data)
  }
})
