import { Descriptor } from '@fangcha/tools'

export enum FeishuEmployeeStatus {
  WillJoin = 1, // 待入职
  Working = 2, // 在职
  Canceled = 3, // 已取消入职
  WillQuit = 4, // 待离职
  Exited = 5, // 已离职
}

const values = [
  FeishuEmployeeStatus.WillJoin,
  FeishuEmployeeStatus.Working,
  FeishuEmployeeStatus.Canceled,
  FeishuEmployeeStatus.WillQuit,
  FeishuEmployeeStatus.Exited,
]

const describe = (code: FeishuEmployeeStatus) => {
  switch (code) {
    case FeishuEmployeeStatus.WillJoin:
      return '待入职'
    case FeishuEmployeeStatus.Working:
      return '在职'
    case FeishuEmployeeStatus.Canceled:
      return '已取消入职'
    case FeishuEmployeeStatus.WillQuit:
      return '待离职'
    case FeishuEmployeeStatus.Exited:
      return '已离职'
  }
  return 'Unknown'
}

export const FeishuEmployeeStatusDescriptor = new Descriptor(values, describe)
