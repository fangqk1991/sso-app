import { P_GroupDetail } from '../admin/GroupModels'

export class GroupCalculator {
  public static fillGroupsFullSubGroupIdList(groups: P_GroupDetail[], groupData: { [p: string]: P_GroupDetail }) {
    groups.forEach((group) => {
      groupData[group.groupId] = group
    })

    for (const curGroup of groups) {
      const groupMapper: { [groupId: string]: P_GroupDetail } = {
        [curGroup.groupId]: curGroup,
      }
      let finished = false
      while (!finished) {
        const prevCount = Object.keys(groupMapper).length
        const subGroupIdList: string[] = []
        for (const subGroup of Object.values(groupMapper)) {
          subGroupIdList.push(...subGroup.subGroupIdList.filter((groupId) => !groupMapper[groupId]))
        }
        const items = subGroupIdList
          .map((groupId) => groupData[groupId])
          .filter((group) => group && !group.blackPermission)
        for (const item of items) {
          groupMapper[item.groupId] = item
        }
        if (Object.keys(groupMapper).length === prevCount) {
          finished = true
          break
        }
      }
      curGroup.fullSubGroupIdList = Object.keys(groupMapper)
    }
  }
}
