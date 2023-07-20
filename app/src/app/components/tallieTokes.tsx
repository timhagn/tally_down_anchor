'use client'

import UpdateTallieTokes from '@/app/components/updateTallieTokes'
import PastTokes from '@/app/components/pastTokes'

import React, { useMemo } from 'react'
import { useTallyDownProgram } from '@/app/providers/tallyDownProgramProvider'
import { getUTCTimeString } from '@/lib/timeUtils'
import { getPastNumberOfTokes, processPastTokes } from '@/lib/pastTokeUtils'

export default function TallieTokes() {
  const { initialProgramState } = useTallyDownProgram()
  console.log(initialProgramState)
  const {
    numberOfTokes,
    pastNumberOfTokes,
    lastTokeAt,
    pastTokesResult = [],
  } = useMemo(() => {
    if (initialProgramState) {
      const pastTokesResult = processPastTokes(initialProgramState.tokes)
      return {
        numberOfTokes: initialProgramState.currentTokeCount,
        pastNumberOfTokes: getPastNumberOfTokes(pastTokesResult),
        lastTokeAt: getUTCTimeString(initialProgramState.currentTokeTime),
        pastTokesResult,
      }
    }
    return { numberOfTokes: 0, pastNumberOfTokes: 0, lastTokeAt: '' }
  }, [initialProgramState])
  return (
    <div className="w-full md:w-1/2">
      <UpdateTallieTokes
        numberOfTokes={numberOfTokes}
        pastNumberOfTokes={pastNumberOfTokes}
        lastTokeAt={lastTokeAt}
        key={lastTokeAt}
      />
      <PastTokes pastTokesResult={pastTokesResult} />
    </div>
  )
}
