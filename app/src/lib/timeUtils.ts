import { BN } from '@coral-xyz/anchor'

export const convertUTCTimeToLocal = (timeToConvert: string) => {
  const [hours, minutes, seconds] = timeToConvert.split(':')
  const currentDateTime = new Date()
  currentDateTime.setUTCHours(parseInt(hours))
  currentDateTime.setUTCMinutes(parseInt(minutes))
  currentDateTime.setUTCSeconds(parseInt(seconds))
  return currentDateTime
}

export const tokeTimeToDate = (tokeTime: BN) =>
  new Date(tokeTime.toNumber() * 1000)

export const getUTCTimeString = (tokeTime: BN) => {
  const currentDateTime = tokeTimeToDate(tokeTime)
  const utcHours = currentDateTime.getUTCHours()
  const utcMinutes = currentDateTime.getUTCMinutes()
  const utcSeconds = currentDateTime.getUTCSeconds()
  return `${utcHours}:${utcMinutes}:${utcSeconds}`
}

export const tokeTimeToDates = (tokeTime: BN[]) => tokeTime.map(tokeTimeToDate)

export const getLastMidnightTime = () => {
  let today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.getTime() / 1000
}
