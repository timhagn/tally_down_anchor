'use client'

import TallieTokes from '@/app/components/tallieTokes'
import Header from '@/app/components/header'
import React from 'react'
import WalletConnectionProvider from '@/app/providers/walletConnectionProvider'
import { TallyDownProgramProvider } from '@/app/providers/tallyDownProgramProvider'

export default function Home() {
  return (
    <WalletConnectionProvider walletButtonWrapperClassName="mt-3">
      <TallyDownProgramProvider>
        <main className="flex flex-col items-center justify-center p-8 md:p-24">
          <Header />
          <TallieTokes />
        </main>
      </TallyDownProgramProvider>
    </WalletConnectionProvider>
  )
}
