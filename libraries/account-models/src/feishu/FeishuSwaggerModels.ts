import { SwaggerModelDefinitionV2, TypicalSwaggerModel } from '@fangcha/swagger'
import { FeishuDepartmentMemberModel, FeishuDepartmentModel, FeishuUserModel } from './FeishuModels'

// public modelForClient(): FeishuUserModel {
//   return {
//     unionId: this.unionId,
//     userId: this.userId,
//     openId: this.openId,
//     name: this.name,
//     isValid: this.isValid,
//   }
// }

// on_bda1e52aacc43b70143f56f0df6a0ae3

export const FeishuSwaggerModels = {
  Swagger_FeishuStaffSearchParams: {
    name: 'Swagger_FeishuStaffSearchParams',
    schema: {
      type: 'object',
      properties: {
        unionIdList: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['on_9267c52f317bb652285303ca6d629733', 'on_bda1e52aacc43b70143f56f0df6a0ae3'],
        },
      },
    },
  } as SwaggerModelDefinitionV2,
  Swagger_FeishuUser: {
    name: 'Swagger_FeishuUser',
    schema: {
      type: 'object',
      properties: {
        unionId: {
          type: 'string',
          example: 'on_bda1e52aacc43b70143f56f0df6a0ae3',
        },
        userId: {
          type: 'string',
          example: 'af1bgc48',
        },
        openId: {
          type: 'string',
          example: 'ou_efe564bf684e62f2c6b2785d9dd65a06',
        },
        name: {
          type: 'string',
          example: 'Fang',
        },
        isValid: {
          type: 'enum',
          description: '是否为激活状态',
          enum: [0, 1],
          example: 1,
        },
      },
    },
  } as TypicalSwaggerModel<FeishuUserModel>,
  Swagger_FeishuDepartment: {
    name: 'Swagger_FeishuDepartment',
    schema: {
      type: 'object',
      properties: {
        openDepartmentId: {
          type: 'string',
          example: '0',
        },
        parentOpenDepartmentId: {
          type: 'string',
          example: '0',
        },
        departmentName: {
          type: 'string',
          example: 'ROOT',
        },
        path: {
          type: 'string',
          example: '0',
        },
      },
    },
  } as TypicalSwaggerModel<FeishuDepartmentModel>,
  Swagger_FeishuDepartmentMember: {
    name: 'Swagger_FeishuDepartmentMember',
    schema: {
      type: 'object',
      properties: {
        unionId: {
          type: 'string',
          example: 'on_bda1e52aacc43b70143f56f0df6a0ae3',
        },
        openDepartmentId: {
          type: 'string',
          example: '0',
        },
        isLeader: {
          type: 'string',
          description: '是否为管理员',
          enum: [0, 1],
          example: 1,
        },
        name: {
          type: 'string',
          example: 'Fang',
        },
      },
    },
  } as TypicalSwaggerModel<FeishuDepartmentMemberModel>,
  Swagger_FeishuDepartmentTree: {
    name: 'Swagger_FeishuDepartmentTree',
    schema: {
      allOf: [
        {
          $ref: '#/definitions/Swagger_FeishuDepartment',
        },
        {
          type: 'object',
          properties: {
            subDepartmentList: {
              type: 'array',
              items: {
                type: 'object',
                example: {
                  openDepartmentId: 'od-ee055ab0ea5df518d478fc3820f0ff19',
                  parentOpenDepartmentId: '0',
                  departmentName: 'Child-1',
                  path: '0,od-ee055ab0ea5df518d478fc3820f0ff19',
                },
              },
            },
            memberList: {
              type: 'array',
              items: {
                $ref: '#/definitions/Swagger_FeishuDepartmentMember',
              },
            },
          },
        },
      ],
    },
  } as SwaggerModelDefinitionV2,
  Swagger_FeishuUserList: {
    name: 'Swagger_FeishuUserList',
    schema: {
      type: 'array',
      items: {
        $ref: '#/definitions/Swagger_FeishuUser',
      },
    },
  } as SwaggerModelDefinitionV2,
}

export const FeishuSwaggerModelList: SwaggerModelDefinitionV2[] = Object.keys(FeishuSwaggerModels).map(
  (key) => FeishuSwaggerModels[key]
)
