export class AppPages {
  public static AppListRoute = '/v1/app'
  public static AppDetailRoute = '/v1/app/:appid'
  public static AppAccessRoute = '/v1/app/:appid/access'

  public static GroupDetailRoute = '/v1/app/:appid/group/:groupId'
  public static GroupAccessRoute = '/v1/app/:appid/group/:groupId/access'

  public static ClientListRoute = '/v1/client'
  public static ClientDetailRoute = '/v1/client/:clientId'

  public static AccountListRoute = '/v1/account'

  public static EnterpriseFeishuRoute = '/v1/enterprise/feishu'
}
