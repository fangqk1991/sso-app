import { SwaggerModelDefinitionV2, TypicalSwaggerModel } from '@fangcha/swagger'
import { NotificationBatchNotifyParams, NotificationParams } from '../NotificationModels'

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
  Swagger_NotificationBatchParams: {
    name: 'Swagger_NotificationBatchParams',
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
        accountUidList: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  } as TypicalSwaggerModel<NotificationBatchNotifyParams>,
}

export const NotificationSwaggerModels: SwaggerModelDefinitionV2[] = Object.keys(NotificationSwaggerModelData).map(
  (key) => NotificationSwaggerModelData[key]
)
