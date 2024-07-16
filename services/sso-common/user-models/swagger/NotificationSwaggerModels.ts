import { SwaggerModelDefinitionV2, TypicalSwaggerModel } from '@fangcha/swagger'
import { NotificationParams } from '../NotificationModels'

export const NotificationSwaggerModelData = {
  Swagger_NotificationParams: {
    name: 'Swagger_NotificationParams',
    schema: {
      type: 'object',
      properties: {
        templateId: {
          type: 'string',
          example: '',
        },
        params: {
          type: 'object',
        },
        url: {
          type: 'string',
          example: '',
        },
        accountUid: {
          type: 'string',
          example: '',
        },
        unionId: {
          type: 'string',
          example: '',
        },
        openId: {
          type: 'string',
          example: '',
        },
      },
    },
  } as TypicalSwaggerModel<NotificationParams>,
}

export const NotificationSwaggerModels: SwaggerModelDefinitionV2[] = Object.keys(NotificationSwaggerModelData).map(
  (key) => NotificationSwaggerModelData[key]
)
