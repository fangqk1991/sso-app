import { SwaggerModelDefinitionV2, TypicalSwaggerModel } from '@fangcha/swagger'
import { AppFullInfo, FullGroupInfo, PermissionMeta, PermissionsGrantParams } from '@fangcha/account-models'

export const UserSwaggerModelData = {
  Swagger_FullGroupInfo: {
    name: 'Swagger_FullGroupInfo',
    schema: {
      type: 'object',
      properties: {
        appid: {
          type: 'string',
          example: 'demo',
        },
        groupId: {
          type: 'string',
          example: 'xxx',
        },
        groupAlias: {
          type: 'string',
          example: 'basic',
        },
        name: {
          type: 'string',
          example: '基础访问',
        },
        remarks: {
          type: 'string',
          example: '备注',
        },
        author: {
          type: 'string',
          example: 'xxx@fqk.io',
        },
        createTime: {
          type: 'string',
          example: '2021-11-24T07:07:35+08:00',
        },
        updateTime: {
          type: 'string',
          example: '2021-11-24T07:07:35+08:00',
        },
        permissionKeys: {
          type: 'array',
          items: {
            type: 'string',
            example: 'accessAll',
          },
        },
        memberEmails: {
          type: 'array',
          items: {
            type: 'string',
            example: 'xyz@fqk.io',
          },
        },
        groupSecrets: {
          type: 'array',
          items: {
            type: 'string',
            example: '1234567890',
          },
        },
      },
    },
  } as TypicalSwaggerModel<FullGroupInfo>,
  Swagger_PermissionMeta: {
    name: 'Swagger_PermissionMeta',
    schema: {
      type: 'object',
      properties: {
        permissionKey: {
          type: 'string',
          example: 'accessAll',
        },
        name: {
          type: 'string',
          example: '所有权限',
        },
        description: {
          type: 'string',
          example: '所有权限',
        },
        children: {
          type: 'array',
          items: {
            $ref: '#/definitions/Swagger_PermissionMeta',
          },
        },
      },
    },
  } as TypicalSwaggerModel<PermissionMeta>,
  Swagger_StaffPermissionsGrantParams: {
    name: 'Swagger_StaffPermissionsGrantParams',
    schema: {
      type: 'object',
      properties: {
        permissionKeys: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['P_1', 'P_2'],
        },
      },
    },
  } as TypicalSwaggerModel<PermissionsGrantParams>,
  Swagger_AppFullInfo: {
    name: 'Swagger_AppFullInfo',
    schema: {
      type: 'object',
      properties: {
        appid: {
          type: 'string',
          example: 'demo',
        },
        name: {
          type: 'string',
          example: 'demo',
        },
        remarks: {
          type: 'string',
          example: '备注',
        },
        permissionMeta: {
          $ref: '#/definitions/Swagger_PermissionMeta',
        },
        powerUserList: {
          type: 'array',
          items: {
            type: 'string',
            example: 'xxx@fqk.io',
          },
        },
        groups: {
          type: 'array',
          items: {
            $ref: '#/definitions/Swagger_FullGroupInfo',
          },
        },
      },
    },
  } as TypicalSwaggerModel<AppFullInfo>,
}

export const UserSwaggerModelList: SwaggerModelDefinitionV2[] = Object.keys(UserSwaggerModelData).map(
  (key) => UserSwaggerModelData[key]
)
