import VueI18n from 'vue-i18n'
import { MessageBox } from 'element-ui'
import { ElMessageBoxOptions } from 'element-ui/types/message-box'
import { i18n } from '@fangcha/vue'

interface ShowAlertExtra {
  title?: string | VueI18n.TranslateResult
  dangerouslyUseHTMLString?: boolean
}

const initialShowAlertExtra: ShowAlertExtra = {
  title: i18n.t('prompt'),
}

export function showAlert(content: string | VueI18n.TranslateResult, extra = initialShowAlertExtra) {
  const _extra = Object.assign({}, initialShowAlertExtra, extra)

  const options: ElMessageBoxOptions = {
    confirmButtonText: i18n.t('confirm') as string,
  }

  if (_extra.dangerouslyUseHTMLString) {
    options.dangerouslyUseHTMLString = true
  }

  MessageBox.alert(content as string, _extra.title as string, options)
}
