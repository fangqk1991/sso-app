import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { SafeTask } from '@fangcha/tools'
import { DemoDBOptions } from './db-config'

const modelTmpl = `${__dirname}/model.tmpl.ejs`
const extendTmpl = `${__dirname}/class.extends.model.ejs`

const generator = new ModelGenerator({
  dbConfig: DemoDBOptions,
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
    primaryKey: ['carrier_uid', 'carrier_type'],
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
]

SafeTask.run(async () => {
  for (const schema of generalDataSchemas) {
    const generator = schema.generator!
    const data = await generator.generateData(schema)
    generator.buildModel(schema, data)
  }
})
