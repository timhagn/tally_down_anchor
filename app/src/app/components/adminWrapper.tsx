'use client'

import React from 'react'
import WalletConnectionProvider from '@/app/providers/walletConnectionProvider'
import { TallyDownProgramProvider } from '@/app/providers/tallyDownProgramProvider'
import { TallyTokes } from '@/lib/sqliteDb'
import AdminDashboard from '@/app/components/adminDashboard'

export default function AdminWrapper({
  todayPuffs,
  pastTokesResult,
}: {
  todayPuffs: TallyTokes
  pastTokesResult: TallyTokes[]
}) {
  return (
    <WalletConnectionProvider walletButtonWrapperClassName="mt-3">
      <TallyDownProgramProvider>
        <main className="flex flex-col items-center justify-center p-8 md:p-24">
          <AdminDashboard
            todayPuffs={todayPuffs}
            pastTokesResult={pastTokesResult}
          />
        </main>
      </TallyDownProgramProvider>
    </WalletConnectionProvider>
  )
}
