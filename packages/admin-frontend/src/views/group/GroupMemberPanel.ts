import { Component, ConfirmDialog, Prop, SimpleInputDialog, SimplePickerDialog, ViewController } from '@fangcha/vue'
import { Watch } from 'vue-property-decorator'
import { MyAxios } from '@fangcha/vue/basic'
import { CommonAPI } from '@fangcha/app-request'
import { P_MemberInfo } from '@fangcha/account-models'
import { CommonAppApis } from '@web/sso-common/core-api'

@Component({
  template: `
    <div v-loading="isLoading">
      <h4>成员列表</h4>
      <div class="mb-2">
        <el-button type="primary" size="mini" @click="onAddMember">添加成员</el-button>
        <el-button type="warning" size="mini" @click="onBatchAddMembers">批量添加成员</el-button>
      </div>
      <hr />
      <div class="mb-4" style="line-height: 2">
        <el-tag
          v-for="member in memberList"
          :key="member.member"
          :type="getTagType(member)"
          size="small"
          :closable="true"
          @click="onUpdateMember(member)"
          @close="onRemoveMember(member)"
          class="mr-2"
        >
          {{ member.member }}
        </el-tag>
      </div>
    </div>
  `,
})
export class GroupMemberPanel extends ViewController {
  @Prop({ default: '成员信息', type: String }) readonly title!: string
  @Prop({ default: '', type: String }) readonly appid!: string
  @Prop({ default: '', type: String }) readonly groupId!: string
  memberList: P_MemberInfo[] = []

  viewDidLoad() {
    this.reloadMembers()
  }

  @Watch('groupId')
  onValueChanged() {
    this.reloadMembers()
  }

  async reloadMembers() {
    if (!this.groupId) {
      this.memberList = []
      return
    }
    const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupMemberListGet, this.appid, this.groupId))
    this.memberList = await request.quickSend()
  }

  getTagType(member: P_MemberInfo) {
    if (member.isAdmin) {
      return 'danger'
    }
    return ''
  }

  onAddMember() {
    const dialog = new SimpleInputDialog()
    dialog.title = '添加成员'
    dialog.show(async (email) => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupMemberCreate, this.appid, this.groupId))
      request.setBodyData({ memberList: [email] })
      await request.execute()
      this.$message.success(`添加成功`)
      this.reloadMembers()
    })
  }

  onBatchAddMembers() {
    const dialog = SimpleInputDialog.textareaDialog()
    dialog.title = '批量添加成员'
    dialog.description = '多个成员请用 , 分割'
    dialog.show(async (memberListStr: string) => {
      const memberList = memberListStr
        .split(/[,;\n]/)
        .map((item) => item.trim())
        .filter((item) => !!item)
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupMemberCreate, this.appid, this.groupId))
      request.setBodyData({ memberList: memberList })
      await request.execute()
      this.$message.success(`添加成功`)
      this.reloadMembers()
    })
  }

  onUpdateMember(member: P_MemberInfo) {
    const dialog = SimplePickerDialog.dialogForTinyInt('是否管理员')
    dialog.curValue = member.isAdmin
    dialog.show(async (isAdmin: number) => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupMemberUpdate, this.appid, this.groupId, member.member))
      request.setBodyData({
        isAdmin: isAdmin,
      })
      await request.execute()
      this.$message.success('更新成功')
      this.reloadMembers()
    })
  }

  onRemoveMember(member: P_MemberInfo) {
    const dialog = new ConfirmDialog()
    dialog.title = '移除成员'
    dialog.content = `确定要移除 "${member.member}" 吗？`
    dialog.show(async () => {
      const request = MyAxios(new CommonAPI(CommonAppApis.AppGroupMemberDelete, this.appid, this.groupId, member.member))
      await request.execute()
      this.$message.success('移除成功')
      this.reloadMembers()
    })
  }
}
