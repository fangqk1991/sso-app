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
    tableName: 'fc_weixin_user',
    outputFile: `${__dirname}/../src/models/auto-build/__WeixinUser.ts`,
    extFile: `${__dirname}/../src/models/weixin/_WeixinUser.ts`,
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    generator: generator,
    tableName: 'fc_weixin_openid',
    outputFile: `${__dirname}/../src/models/auto-build/__WeixinOpenid.ts`,
    extFile: `${__dirname}/../src/models/weixin/_WeixinOpenid.ts`,
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
