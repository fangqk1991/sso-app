export interface NotificationParams {
  templateId: string
  params: {}
  url?: string
  accountUid?: string
  unionId?: string
  openId?: string

  accountUidList?: string[]
}

export interface NotificationBatchNotifyParams {
  templateId: string
  params: {}
  url?: string
  accountUidList: string[]
}
