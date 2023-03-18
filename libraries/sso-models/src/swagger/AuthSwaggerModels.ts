import { SwaggerModelDefinitionV2, TypicalSwaggerModel } from '@fangcha/swagger'
import { AccountSimpleParams, PasswordUpdateParams, VisitorCoreInfo } from '@fangcha/account-models'

export const AuthSwaggerModelData = {
  Swagger_AccountSimpleParams: {
    name: 'Swagger_AccountSimpleParams',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'xxx@email.com',
        },
        password: {
          type: 'string',
          example: 'some_password',
        },
      },
    },
  } as TypicalSwaggerModel<AccountSimpleParams>,
  Swagger_VisitorCoreInfo: {
    name: 'Swagger_VisitorCoreInfo',
    schema: {
      type: 'object',
      properties: {
        accountUid: {
          type: 'string',
          example: 'xxxxxxxx',
        },
        email: {
          type: 'string',
          example: 'xxx@email.com',
        },
      },
    },
  } as TypicalSwaggerModel<VisitorCoreInfo>,
  Swagger_PasswordUpdateParams: {
    name: 'Swagger_PasswordUpdateParams',
    schema: {
      type: 'object',
      properties: {
        curPassword: {
          type: 'string',
          example: 'xxxxxxxx',
        },
        newPassword: {
          type: 'string',
          example: 'xxxxxxxx',
        },
      },
    },
  } as TypicalSwaggerModel<PasswordUpdateParams>,
}

export const AuthSwaggerModelList: SwaggerModelDefinitionV2[] = Object.keys(AuthSwaggerModelData).map(
  (key) => AuthSwaggerModelData[key]
)
