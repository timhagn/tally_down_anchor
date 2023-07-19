'use client'

import { convertUTCTimeToLocal } from '@/lib/timeUtils'

export default function LastToke({ lastTokeAt }: { lastTokeAt?: string }) {
  if (!lastTokeAt) {
    return <div className="mt-4">&nbsp;</div>
  }
  const currentDateTime = convertUTCTimeToLocal(lastTokeAt)
  const localLastToke = currentDateTime.toLocaleTimeString('en', {
    hour12: false,
  })
  return <div className="mt-4">You puffed the last one at: {localLastToke}</div>
}
