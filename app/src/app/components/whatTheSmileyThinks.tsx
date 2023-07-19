'use client'

import { getEmoji } from '@/lib/getEmoji'

export function WhatTheSmileyThinks({
  numberOfTokes,
  pastNumberOfTokes = 0,
  className,
}: {
  numberOfTokes: number
  pastNumberOfTokes: number
  className?: string
}) {
  const currentSmiley = getEmoji(numberOfTokes, pastNumberOfTokes)
  return <div className={className}>{currentSmiley}</div>
}
