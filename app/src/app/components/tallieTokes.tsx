'use client'

// import { loadPastPuffs, loadTodayPuffs, TallyTokes } from '@/lib/sqliteDb'
import UpdateTallieTokes from '@/app/components/updateTallieTokes'
// import PastTokes from '@/app/components/pastTokes'
import WalletConnectionProvider from '@/app/providers/walletConnectionProvider'
import React from 'react'
import { TallyDownProgramProvider } from '@/app/providers/tallyDownProgramProvider'

export default function TallieTokes() {
  // const { numberOfTokes, lastTokeAt } = await loadTodayPuffs()
  // const pastLoadedTokesResult = await loadPastPuffs()
  // const pastTokesResult = pastLoadedTokesResult?.sort(
  //   (a: TallyTokes, b: TallyTokes) => Date.parse(a.id) - Date.parse(b.id),
  // )
  // const pastNumberOfTokes =
  //   pastTokesResult?.[pastTokesResult?.length - 1]?.numberOfTokes || 0
  return (
    <WalletConnectionProvider walletButtonWrapperClassName="mt-3">
      <TallyDownProgramProvider>
        <div className="w-full md:w-1/2">
          <UpdateTallieTokes
            numberOfTokes={0}
            pastNumberOfTokes={0}
            lastTokeAt={''}
          />
          {/*<PastTokes pastTokesResult={pastTokesResult} />*/}
        </div>
      </TallyDownProgramProvider>
    </WalletConnectionProvider>
  )
}
