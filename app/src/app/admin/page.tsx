'use server'

import { loadPastPuffs, loadTodayPuffs, TallyTokes } from '@/lib/sqliteDb'
import AdminWrapper from '@/app/components/adminWrapper'

export default async function AdminPage() {
  const todayPuffs = await loadTodayPuffs()
  const pastLoadedTokesResult = await loadPastPuffs()

  return (
    <AdminWrapper
      todayPuffs={todayPuffs}
      pastTokesResult={pastLoadedTokesResult}
    />
  )
}
