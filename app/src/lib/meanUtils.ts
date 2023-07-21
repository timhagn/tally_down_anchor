import { TallyTokes } from '@/lib/sqliteDb'

export const calculateMean = (pastTokes: TallyTokes[]): number => {
  if (!pastTokes.length) {
    return 0
  }
  const pastTokeCounts = pastTokes.map(({ numberOfTokes }) => numberOfTokes)
  const meanSum = pastTokeCounts.reduce((acc, tokes) => acc + tokes, 0)
  return Math.round(meanSum / pastTokeCounts.length)
}

export const calculateMedian = (pastTokes: TallyTokes[]): number => {
  if (!pastTokes.length) {
    return 0
  }
  const pastTokesCopy = [...pastTokes]
  const pastTokeCountsSorted = pastTokesCopy.sort(
    (a: TallyTokes, b: TallyTokes) => a.numberOfTokes - b.numberOfTokes,
  )
  const tokeCounts = pastTokeCountsSorted.map(
    ({ numberOfTokes }) => numberOfTokes,
  )
  const middleToke = tokeCounts.length / 2
  if (middleToke % 2 !== 0) {
    return tokeCounts[Math.floor(middleToke)]
  }
  const middleTokes = [
    pastTokeCountsSorted[Math.floor(middleToke)],
    pastTokeCountsSorted[Math.ceil(middleToke)],
  ]
  return calculateMean(middleTokes)
}
