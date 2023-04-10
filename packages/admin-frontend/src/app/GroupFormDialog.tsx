import { ProForm, ProFormDependency, ProFormRadio, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { GroupCategory, GroupCategoryDescriptor, P_GroupParams } from '@fangcha/account-models'
import { NumBoolDescriptor } from '@fangcha/tools'
import { DialogProps, ReactDialog } from '@fangcha/react'
import { DepartmentSelector } from './DepartmentSelector'

type Props = DialogProps & {
  params?: Partial<P_GroupParams>
  forEditing?: boolean
}

export class GroupFormDialog extends ReactDialog<Props, P_GroupParams> {
  title = '用户组'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const params = JSON.parse(
        JSON.stringify(
          props.params ||
            ({
              name: '',
              remarks: '',
              groupAlias: '',
              isRetained: 0,
              isEnabled: 1,
              groupCategory: GroupCategory.Custom,
              departmentId: null,
              isFullDepartment: 0,
              blackPermission: 0,
              subGroupIdList: [],
            } as P_GroupParams)
        )
      )
      const [form] = Form.useForm<P_GroupParams>()
      props.context.handleResult = () => {
        return {
          ...params,
          ...form.getFieldsValue(),
        }
      }
      return (
        <ProForm form={form} autoFocusFirstInput initialValues={params} submitter={false}>
          {props.forEditing && <ProFormText name='groupAlias' label='Alias' />}
          <ProFormRadio.Group
            name='groupCategory'
            label='类别'
            options={GroupCategoryDescriptor.options()}
            radioType='button'
          />
          <ProFormText name='name' label='名称' />
          <ProFormText name='remarks' label='备注' />
          <ProFormRadio.Group
            name='isEnabled'
            label='是否有效'
            options={NumBoolDescriptor.options()}
            radioType='button'
          />
          <ProFormDependency key='departmentId' name={['groupCategory']}>
            {({ groupCategory }) => {
              if (groupCategory === GroupCategory.Department) {
                return <DepartmentSelector name='departmentId' />
              }
            }}
          </ProFormDependency>
          <ProFormDependency key='isFullDepartment' name={['departmentId']}>
            {({ departmentId }) => {
              if (!!departmentId) {
                return (
                  <ProFormRadio.Group
                    name='isFullDepartment'
                    label='关联属性'
                    options={[
                      {
                        label: '含子孙部门',
                        value: 1,
                      },
                      {
                        label: '不含子孙部门',
                        value: 0,
                      },
                    ]}
                    radioType='button'
                  />
                )
              }
            }}
          </ProFormDependency>
          <ProFormDependency key='isFullDepartmentHint' name={['departmentId', 'isFullDepartment']}>
            {({ departmentId, isFullDepartment }) => {
              if (!!departmentId) {
                return (
                  <b className={'text-danger'}>
                    {isFullDepartment
                      ? '组成员包含该部门及其子孙部门的所有员工'
                      : '组成员包含该部门一级节点（不包含子孙部门）的员工'}
                  </b>
                )
              }
            }}
          </ProFormDependency>
        </ProForm>
      )
    }
  }
}
