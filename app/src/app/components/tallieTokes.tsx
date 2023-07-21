'use client'

import UpdateTallieTokes from '@/app/components/updateTallieTokes'
import PastTokes from '@/app/components/pastTokes'

import React, { useMemo } from 'react'
import { useTallyDownProgram } from '@/app/providers/tallyDownProgramProvider'
import { useWallet } from '@solana/wallet-adapter-react'
import Spinner from '@/app/components/spinner'
import { processInitialProgramState } from '@/lib/tallyTokeUtils'

export default function TallieTokes() {
  const { initialProgramState } = useTallyDownProgram()
  const { connected, connecting, disconnecting } = useWallet()
  console.log(initialProgramState)
  const {
    numberOfTokes,
    pastNumberOfTokes,
    lastTokeAt,
    pastTokesResult = [],
  } = useMemo(
    () => processInitialProgramState(initialProgramState),
    [initialProgramState],
  )
  return (
    <div className="w-full md:w-1/2">
      {!connected ? (
        <div className="text-center">
          <h2 className="font-bold my-6">
            Connect your wallet to count your Puffs!
          </h2>
        </div>
      ) : connecting || disconnecting ? (
        <Spinner />
      ) : (
        <>
          <UpdateTallieTokes
            numberOfTokes={numberOfTokes}
            pastNumberOfTokes={pastNumberOfTokes}
            lastTokeAt={lastTokeAt}
            key={lastTokeAt}
          />
          <PastTokes pastTokesResult={pastTokesResult} />
        </>
      )}
    </div>
  )
}
