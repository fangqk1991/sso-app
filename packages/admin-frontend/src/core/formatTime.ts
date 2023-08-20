import * as moment from 'moment'

export const formatTime = (timeStr: string, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(timeStr).format(formatStr)
}
