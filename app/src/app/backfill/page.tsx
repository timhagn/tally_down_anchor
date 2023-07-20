'use server'

import { loadPastPuffs, TallyTokes } from '@/lib/sqliteDb'
import BackfillWrapper from '@/app/components/backfillWrapper'

export default async function Backfill() {
  const pastLoadedTokesResult = await loadPastPuffs()
  const pastTokesResult = pastLoadedTokesResult?.sort(
    (a: TallyTokes, b: TallyTokes) => Date.parse(a.id) - Date.parse(b.id),
  )
  return <BackfillWrapper pastTokesResult={pastTokesResult} />
}
