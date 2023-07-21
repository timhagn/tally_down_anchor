import { TallyTokes } from '@/lib/sqliteDb'
import PastTokes from '@/app/components/pastTokes'
import React, { useCallback, useState } from 'react'
import { convertOldTokes, getPastNumberOfTokes } from '@/lib/pastTokeUtils'
import { useTallyDownProgram } from '@/app/providers/tallyDownProgramProvider'
import { WhatTheSmileyThinks } from '@/app/components/whatTheSmileyThinks'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { getBalanceInWallet } from '@/lib/web3Helpers'
import { TokeSave } from '@/app/types/tallyDown'

export default function BackfillFromDB({
  pastTokesResult,
}: {
  pastTokesResult: TallyTokes[]
}) {
  const { backfillTokes, sendResetDay } = useTallyDownProgram()
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [programState, setProgramState] = useState<TokeSave>()
  const [walletBalance, setWalletBalance] = useState<number>()
  const pastNumberOfTokes = getPastNumberOfTokes(pastTokesResult)

  const onBackfillClick = useCallback(async () => {
    const oldTokes = convertOldTokes(pastTokesResult)
    const currentProgramState = await backfillTokes(oldTokes)
    if (currentProgramState) {
      setProgramState(currentProgramState)
    }
  }, [backfillTokes, pastTokesResult])

  const onResetDayClick = useCallback(async () => {
    const currentProgramState = await sendResetDay()
    if (currentProgramState) {
      setProgramState(currentProgramState)
    }
  }, [sendResetDay])

  const onGetBalanceClick = useCallback(async () => {
    if (connection && publicKey) {
      const balance = await getBalanceInWallet(connection, publicKey)
      setWalletBalance(balance)
    }
  }, [])

  return (
    <>
      <h1 className="text-2xl font-bold text-center">
        Click Backfill to import tokes of {pastNumberOfTokes} days from DB
      </h1>
      <button
        type="submit"
        className="btn btn-blue mt-8"
        onClick={onBackfillClick}
      >
        Backfill
      </button>
      <p className="mt-4">or</p>
      <button
        type="submit"
        className="btn btn-blue mt-4"
        onClick={onResetDayClick}
      >
        Reset Day
      </button>
      <button
        type="submit"
        className="btn mt-4 text-sm"
        onClick={onGetBalanceClick}
      >
        Get Balance of Wallet
      </button>
      {walletBalance && <p className="text-sm mt-4">{walletBalance} SOL</p>}
      {programState?.tokes?.length && (
        <>
          <h2 className="font-bold my-6">
            Success! Backfilled {programState.tokes.length} days of tokes!
          </h2>
          <WhatTheSmileyThinks
            numberOfTokes={0}
            pastNumberOfTokes={100}
            className="text-3xl text-center"
          />
        </>
      )}
      {programState?.currentTokeCount === 0 && (
        <>
          <h2 className="font-bold my-6">
            Success! Reset the days toke count!
          </h2>
          <WhatTheSmileyThinks
            numberOfTokes={0}
            pastNumberOfTokes={100}
            className="text-3xl text-center"
          />
        </>
      )}
      <div className="w-full md:w-1/2">
        <PastTokes pastTokesResult={pastTokesResult} />
      </div>
    </>
  )
}
