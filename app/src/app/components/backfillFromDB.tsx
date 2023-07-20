import { TallyTokes } from '@/lib/sqliteDb'
import PastTokes from '@/app/components/pastTokes'
import React, { useCallback, useState } from 'react'
import { convertOldTokes, getPastNumberOfTokes } from '@/lib/pastTokeUtils'
import {
  TokeSave,
  useTallyDownProgram,
} from '@/app/providers/tallyDownProgramProvider'
import { WhatTheSmileyThinks } from '@/app/components/whatTheSmileyThinks'

export default function BackfillFromDB({
  pastTokesResult,
}: {
  pastTokesResult: TallyTokes[]
}) {
  const { backfillTokes, sendResetDay } = useTallyDownProgram()
  const [programState, setProgramState] = useState<TokeSave>()
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
