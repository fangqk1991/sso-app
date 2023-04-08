import { Descriptor } from '@fangcha/tools'

export enum GroupCategory {
  Custom = 'Custom',
  Department = 'Department',
}

const values = [GroupCategory.Custom, GroupCategory.Department]

const describe = (code: GroupCategory) => {
  switch (code) {
    case GroupCategory.Custom:
      return '自定义组'
    case GroupCategory.Department:
      return '部门组'
  }
  return 'Unknown'
}

export const GroupCategoryDescriptor = new Descriptor(values, describe)
