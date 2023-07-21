'use client'

import { useState } from 'react'
import Tallies from '@/app/components/tallies'
import { handrawn } from '@/lib/fonts'
import { WhatTheSmileyThinks } from '@/app/components/whatTheSmileyThinks'
import LastToke from '@/app/components/lastToke'
import { getUTCTimeString } from '@/lib/timeUtils'
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
  const [currentNumberOfTokes, setCurrentNumberOfTokes] = useState(
    () => numberOfTokes,
  )
  const [currentLastTokeAt, setCurrentLastTokeAt] = useState(() => lastTokeAt)

  const onToke = async () => {
    const programState = await sendToke()
    if (programState) {
      setCurrentNumberOfTokes(programState.currentTokeCount)
      const utcTimeString = getUTCTimeString(programState.currentTokeTime)
      setCurrentLastTokeAt(utcTimeString)
    }
  }

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
      <button type="submit" className="btn btn-blue mt-3" onClick={onToke}>
        Puffed one
      </button>
      <LastToke lastTokeAt={currentLastTokeAt} />
      <WhatTheSmileyThinks
        numberOfTokes={currentNumberOfTokes}
        pastNumberOfTokes={pastNumberOfTokes}
        className="text-3xl text-center mt-6 mb-10"
      />
    </div>
  )
}
