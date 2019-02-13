export function CelShowTime(time: number): any {
  let showTime = ''
  let useTime = time
  if (useTime >= 60 * 60 * 24) {
    const day = Math.floor(useTime / (60 * 60 * 24))
    showTime += day + 'd '
    useTime = useTime % (60 * 60 * 24)
  }
  if (useTime >= 60 * 60) {
    const hour = Math.floor(useTime / (60 * 60))
    const hourText = hour < 10 ? '0' + hour : hour
    showTime += hourText + ':'
    useTime = useTime % (60 * 60)
  }
  const minute = Math.floor(useTime / 60)
  const minuteText = minute < 10 ? '0' + minute : minute
  showTime += minuteText + ':'
  useTime = useTime % 60
  showTime += useTime < 10 ? '0' + useTime : useTime
  return showTime
}
