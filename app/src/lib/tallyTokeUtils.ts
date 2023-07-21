import { BN, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import {
  getLastMidnightTime,
  getUTCDateString,
  getUTCTimeString,
} from '@/lib/timeUtils'
import { Tokes, TokeSave } from '@/app/types/tallyDown'
import { getPastNumberOfTokes, processPastTokes } from '@/lib/pastTokeUtils'

export const getTallyDownProgramState = async (
  program: Program,
  tallyDownPDA: PublicKey,
): Promise<TokeSave> => {
  try {
    const programState = await program.account.tokeSave.fetch(tallyDownPDA)
    // @ts-ignore
    return programState
  } catch (error: any) {
    throw error
  }
}

export const initTallyDownProgram = async (
  program: Program,
  tallyDownPDA: PublicKey,
  signerPublicKey: PublicKey,
) => {
  try {
    return await program.methods
      .initialize()
      .accounts({
        tokeSave: tallyDownPDA,
        tokeAccount: signerPublicKey,
      })
      .rpc({ commitment: 'confirmed' })
  } catch (error) {
    console.log(error)
  }
}

export const getTallyDownProgramStateOrInit = async (
  program: Program,
  tallyDownPDA: PublicKey,
  signerPublicKey: PublicKey,
): Promise<TokeSave | null> => {
  try {
    return await getTallyDownProgramState(program, tallyDownPDA)
  } catch (error: any) {
    console.log(error)
    if (error?.message?.includes('Account does not exist')) {
      const tx = await initTallyDownProgram(
        program,
        tallyDownPDA,
        signerPublicKey,
      )
      if (tx) {
        return await getTallyDownProgramState(program, tallyDownPDA)
      }
    }
    console.log(error)
  }
  return null
}

export const sendTokeTransaction = async (
  program: Program,
  tallyDownPDA: PublicKey,
  signerPublicKey: PublicKey,
) => {
  try {
    // Get last midnight to compare against in the program.
    const lastMidnight = getLastMidnightTime()

    // Add a new Toke.
    return await program.methods
      .toke(new anchor.BN(lastMidnight))
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signerPublicKey })
      .rpc({ commitment: 'confirmed' })
  } catch (error) {
    console.log(error)
  }
}

export const sendResetDayTransaction = async (
  program: Program,
  tallyDownPDA: PublicKey,
  signerPublicKey: PublicKey,
) => {
  try {
    // Reset Day.
    return await program.methods
      .resetDay()
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signerPublicKey })
      .rpc({ commitment: 'confirmed' })
  } catch (error) {
    console.log(error)
  }
}

export const sendBackfillTokesTransaction = async (
  program: Program,
  tallyDownPDA: PublicKey,
  signerPublicKey: PublicKey,
  oldTokes: Tokes[],
) => {
  try {
    return await program.methods
      .backFillTokes(oldTokes)
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signerPublicKey })
      .rpc({ commitment: 'confirmed' })
  } catch (error) {
    console.log(error)
  }
}

export const processInitialProgramState = (initialProgramState?: TokeSave) => {
  if (initialProgramState) {
    const { tokes, currentTokeCount, currentTokeTime } = initialProgramState
    const pastTokesResult = processPastTokes(tokes)

    const lastMidnight = getLastMidnightTime()
    const lastTokeTime = currentTokeTime.toNumber()
    let numberOfTokes = currentTokeCount
    let lastTokeAt = getUTCTimeString(currentTokeTime)

    // As it might be that the initial toke count wasn't from today we have to add it manually to pastTokesResult
    // if it isn't already present there. The tallyDown Program will only update this on the next toke, so we need
    // to do it here as well. TODO: see TODO in lib.rs...
    if (lastTokeTime < lastMidnight) {
      const id = getUTCDateString(currentTokeTime)
      if (!pastTokesResult.find(({ id: pastId }) => pastId === id)) {
        const pastToke = {
          id,
          numberOfTokes,
          lastTokeAt,
        }
        pastTokesResult.push(pastToke)
      }
      numberOfTokes = 0
      lastTokeAt = ''
    }
    return {
      numberOfTokes: numberOfTokes,
      pastNumberOfTokes: getPastNumberOfTokes(pastTokesResult),
      lastTokeAt: lastTokeAt,
      pastTokesResult,
    }
  }
  return { numberOfTokes: 0, pastNumberOfTokes: 0, lastTokeAt: '' }
}
