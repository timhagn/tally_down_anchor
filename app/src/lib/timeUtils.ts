export const convertUTCTimeToLocal = (timeToConvert: string) => {
  const [hours, minutes, seconds] = timeToConvert.split(':')
  const currentDateTime = new Date()
  currentDateTime.setUTCHours(parseInt(hours))
  currentDateTime.setUTCMinutes(parseInt(minutes))
  currentDateTime.setUTCSeconds(parseInt(seconds))
  return currentDateTime
}

export const getUTCTimeString = () => {
  const currentDateTime = new Date()
  const utcHours = currentDateTime.getUTCHours()
  const utcMinutes = currentDateTime.getUTCMinutes()
  const utcSeconds = currentDateTime.getUTCSeconds()
  return `${utcHours}:${utcMinutes}:${utcSeconds}`
}
