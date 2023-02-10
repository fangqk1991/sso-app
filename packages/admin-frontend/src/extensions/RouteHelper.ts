import { RawLocation } from 'vue-router'

export class RouteHelper {
  public static to_ClientListView(): RawLocation {
    return {
      name: 'ClientListView',
    }
  }

  public static to_MyClientListView(): RawLocation {
    return {
      name: 'MyClientListView',
    }
  }

  public static to_ClientDetailView(params: { clientId: string }): RawLocation {
    return {
      name: 'ClientDetailView',
      params: {
        clientId: params.clientId,
      },
    }
  }

  public static to_GroupDetailView(params: { groupId: string; appid?: string }): RawLocation {
    return {
      name: 'GroupDetailView',
      params: {
        appid: params.appid || '_',
        groupId: params.groupId,
      },
    }
  }
}
