'use client'

import { useEffect, useState } from 'react'
import { addToDb } from '@/app/actions'
import Tallies from '@/app/components/tallies'
import { handrawn } from '@/lib/fonts'
import { WhatTheSmileyThinks } from '@/app/components/whatTheSmileyThinks'
import LastToke from '@/app/components/lastToke'
import { getUTCTimeString } from '@/lib/timeUtils'
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from '@solana/wallet-adapter-react'
import { useTallyDownProgram } from '@/app/providers/tallyDownProgramProvider'

export default function UpdateTallieTokes({
  numberOfTokes,
  lastTokeAt,
  pastNumberOfTokes,
}: {
  numberOfTokes: number
  lastTokeAt?: string
  pastNumberOfTokes: number
}) {
  const { sendToke } = useTallyDownProgram()
  const [currentNumberOfTokes, setCurrentNumberOfTokes] =
    useState(numberOfTokes)
  const [currentLastTokeAt, setCurrentLastTokeAt] = useState(lastTokeAt)
  const { getProgramState } = useTallyDownProgram()

  const onToke = async () => {
    await sendToke()
    setCurrentNumberOfTokes((prev) => prev + 1)
    const utcTimeString = getUTCTimeString()
    setCurrentLastTokeAt(utcTimeString)
  }

  useEffect(() => {
    const runtest = async () => {
      const testState = await getProgramState()
      console.log(testState)
    }
    runtest()
  }, [getProgramState])

  return (
    <div className="text-center">
      {currentNumberOfTokes ? (
        <Tallies
          number={currentNumberOfTokes}
          className={`${handrawn.className} -skew-x-12`}
          textSize={42}
        />
      ) : (
        <div className={`text-[42px]`}>(Don&apos;t) start to puff ; )</div>
      )}
      <form onSubmit={onToke}>
        <button type="submit" className="btn btn-blue mt-3">
          Puffed one
        </button>
      </form>
      <LastToke lastTokeAt={currentLastTokeAt} />
      <WhatTheSmileyThinks
        numberOfTokes={currentNumberOfTokes}
        pastNumberOfTokes={pastNumberOfTokes}
        className="text-3xl text-center mt-6 mb-10"
      />
    </div>
  )
}
