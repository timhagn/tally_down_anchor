import { Tokes } from '@/app/providers/tallyDownProgramProvider'
import { getUTCTimeString } from '@/lib/timeUtils'
import { TallyTokes } from '@/lib/sqliteDb'

export const processPastTokes = (tokes: Tokes[]) =>
  tokes
    .map(
      ({ tokeDate, tokeCount }): TallyTokes => ({
        id: getUTCTimeString(tokeDate),
        numberOfTokes: tokeCount,
        lastTokeAt: '',
      }),
    )
    .sort((a: TallyTokes, b: TallyTokes) => Date.parse(a.id) - Date.parse(b.id))

export const getPastNumberOfTokes = (pastTokesResult: TallyTokes[]) =>
  pastTokesResult[pastTokesResult.length - 1]?.numberOfTokes || 0
