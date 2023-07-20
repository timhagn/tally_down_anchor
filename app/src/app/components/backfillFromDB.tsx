import { TallyTokes } from '@/lib/sqliteDb'
import PastTokes from '@/app/components/pastTokes'
import React from 'react'

export default function BackfillFromDB({
  pastTokesResult,
}: {
  pastTokesResult: TallyTokes[]
}) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center">
        Click Backfill to import old tokes from DB
      </h1>
      <button type="submit" className="btn btn-blue mt-8" onClick={() => {}}>
        Backfill
      </button>
      <div className="w-full md:w-1/2">
        <PastTokes pastTokesResult={pastTokesResult} />
      </div>
    </>
  )
}
