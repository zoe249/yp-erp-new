// import { ref } from 'vue'

export const useDateDisable = (form: any, date: any) => {
  // 输入框默认显示的时间
  const datePlaceholder = ref({
    beginTime: date.beginTime,
    endTime: date.endTime
  })

  // 时间选中的回调函数
  const handleBeginTime = (value: Date) => {
    form.formData.beginTime = value
  }
  const handleEndTime = (value: Date) => {
    form.formData.endTime = value
  }

  // 起止时间禁用
  const disabledBegin = (time: Date) => {
    return time.getTime() < Date.now() - 86400 * 1000
  }
  const disabledEnd = (time: Date) => {
    return time.getTime() <= Date.parse(form.formData.beginTime) - 86400 * 1000
  }

  return {
    datePlaceholder,
    handleBeginTime,
    handleEndTime,
    disabledBegin,
    disabledEnd
  }
}
