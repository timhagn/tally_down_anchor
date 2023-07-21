'use server'

import { loadPastPuffs, loadTodayPuffs, TallyTokes } from '@/lib/sqliteDb'
import AdminWrapper from '@/app/components/adminWrapper'

export default async function AdminPage() {
  const todayPuffs = await loadTodayPuffs()
  const pastLoadedTokesResult = await loadPastPuffs()
  const pastTokesResult = pastLoadedTokesResult?.sort(
    (a: TallyTokes, b: TallyTokes) => Date.parse(a.id) - Date.parse(b.id),
  )
  return (
    <AdminWrapper todayPuffs={todayPuffs} pastTokesResult={pastTokesResult} />
  )
}
