import { BN } from '@coral-xyz/anchor'
import { getUTCDateString, getUTCTimeString } from '@/lib/timeUtils'
import { TallyTokes } from '@/lib/sqliteDb'
import { Tokes } from '@/app/types/tallyDown'

export const processPastTokes = (tokes: Tokes[]) =>
  tokes.map(
    ({ tokeDate, tokeCount }): TallyTokes => ({
      id: getUTCDateString(tokeDate),
      numberOfTokes: tokeCount,
      lastTokeAt: getUTCTimeString(tokeDate),
    }),
  )
// .sort((a: TallyTokes, b: TallyTokes) => Date.parse(a.id) - Date.parse(b.id))

export const getPastNumberOfTokes = (pastTokesResult: TallyTokes[]) =>
  pastTokesResult[pastTokesResult.length - 1]?.numberOfTokes || 0

export const convertOldTokes = (oldTokes: TallyTokes[]): Tokes[] => {
  const oldTokesCopy = [...oldTokes]
  const pastTokesResult = oldTokesCopy.sort(
    (a, b) => Date.parse(a.id) - Date.parse(b.id),
  )
  return pastTokesResult.map(({ id, numberOfTokes, lastTokeAt }) => {
    const tokeDate = Date.parse(`${id} ${lastTokeAt}`) / 1000
    return {
      tokeDate: new BN(tokeDate),
      tokeCount: numberOfTokes,
    }
  })
}
