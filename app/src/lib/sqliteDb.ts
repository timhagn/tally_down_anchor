'use server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const DB_FILENAME =
  process.env.NODE_ENV === 'production'
    ? './tallyDown.db'
    : './tallyDown.dev.db'

export interface TallyTokes {
  id: string
  numberOfTokes: number
  lastTokeAt: string
}

export async function openDb() {
  try {
    const db = await open({
      filename: DB_FILENAME,
      driver: sqlite3.Database,
    })
    await db.exec(
      'CREATE TABLE IF NOT EXISTS tally_tokes (id PRIMARY KEY UNIQUE DEFAULT CURRENT_DATE, numberOfTokes INT, lastTokeAt DEFAULT CURRENT_TIME)'
    )
    return db
  } catch (err: any) {
    console.error(err)
  }
}

export async function loadTodayPuffs(): Promise<Omit<TallyTokes, 'id'>> {
  const db = await openDb()
  if (db) {
    const result = await db.get(
      "SELECT numberOfTokes, lastTokeAt FROM tally_tokes WHERE id = date('now')"
    )
    if (result) {
      const { numberOfTokes, lastTokeAt } = result
      return { numberOfTokes, lastTokeAt }
    }
  }
  return { numberOfTokes: 0, lastTokeAt: '' }
}

export interface TallyTokes {
  id: string
  numberOfTokes: number
  lastTokeAt: string
}

export async function loadPastPuffs(): Promise<TallyTokes[]> {
  const db = await openDb()
  if (db) {
    const result = await db.all(
      "SELECT * FROM tally_tokes WHERE id < date('now')"
    )
    if (result) {
      return result
    }
  }
  return []
}
