import { BN, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import { getLastMidnightTime } from '@/lib/timeUtils'
import { TokeSave } from '@/app/providers/tallyDownProgramProvider'

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
