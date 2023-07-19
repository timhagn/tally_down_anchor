import { TallyTokes } from '@/lib/sqliteDb'
import { calculateMean, calculateMedian } from '@/lib/meanUtils'

export default function PastTokeMeanAndMedian({
  pastTokes,
}: {
  pastTokes: TallyTokes[]
}) {
  if (!pastTokes.length) {
    return null
  }
  const meanTokes = calculateMean(pastTokes)
  const medianTokes = calculateMedian(pastTokes)
  return (
    <span className="text-xs">
      (Ø {meanTokes} - <span className="overline">x</span>{' '}
      <span>{medianTokes}</span>)
    </span>
  )
}
