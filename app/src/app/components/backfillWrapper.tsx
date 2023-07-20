'use client'

import React from 'react'
import WalletConnectionProvider from '@/app/providers/walletConnectionProvider'
import { TallyDownProgramProvider } from '@/app/providers/tallyDownProgramProvider'
import { TallyTokes } from '@/lib/sqliteDb'
import BackfillFromDB from '@/app/components/backfillFromDB'

export default function BackfillWrapper({
  pastTokesResult,
}: {
  pastTokesResult: TallyTokes[]
}) {
  return (
    <WalletConnectionProvider walletButtonWrapperClassName="mt-3">
      <TallyDownProgramProvider>
        <main className="flex flex-col items-center justify-center p-8 md:p-24">
          <BackfillFromDB pastTokesResult={pastTokesResult} />
        </main>
      </TallyDownProgramProvider>
    </WalletConnectionProvider>
  )
}
