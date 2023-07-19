'use server'

import { openDb } from '@/lib/sqliteDb'

export async function addToDb() {
  const db = await openDb()
  if (db) {
    await db.exec(
      "INSERT INTO tally_tokes (id, numberOfTokes, lastTokeAt) VALUES(date('now'), 1, time('now')) ON CONFLICT(id) DO UPDATE SET numberOfTokes = numberOfTokes + 1, lastTokeAt = time('now')"
    )
  }
}
