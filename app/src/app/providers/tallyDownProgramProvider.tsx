'use client'

import {
  Context,
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react'
import { BN, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { getPDASync, getProgram } from '@/lib/web3Helpers'
import {
  getTallyDownProgramStateOrInit,
  sendBackfillTokesTransaction,
  sendResetDayTransaction,
  sendTokeTransaction,
} from '@/lib/tallyTokeUtils'

export interface Tokes {
  tokeDate: BN
  tokeCount: number
}

export interface TokeSave {
  tokeAccount: PublicKey
  currentTokeTime: BN
  currentTokeCount: number
  tokes: Tokes[]
  bump: number
}

interface TallyDownProgramContextProps {
  program: Program | null
  tallyDownPDA: PublicKey | null
  getProgramState: () => any | null
  sendToke: () => any | null
  sendResetDay: () => any | null
  backfillTokes: (oldTokes: Tokes[]) => any | null
  initialProgramState?: TokeSave
}

const TallyDownProgramContextDefaultValues: TallyDownProgramContextProps = {
  program: null,
  tallyDownPDA: null,
  getProgramState: () => {},
  sendToke: () => {},
  sendResetDay: () => {},
  backfillTokes: (oldTokes) => {},
}

export const TallyDownProgramContext: Context<TallyDownProgramContextProps> =
  createContext(TallyDownProgramContextDefaultValues)

export const TallyDownProgramProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet() as AnchorWallet
  const [program, setProgram] = useState<Program | null>(null)
  const [tallyDownPDA, setTallyDownPDA] = useState<PublicKey | null>(null)
  const [initialProgramState, setInitialProgramState] = useState<TokeSave>()

  useEffect(() => {
    if (publicKey !== null && program === null) {
      const anchorProgram = getProgram(connection, wallet)
      const possibleTallyDownPDA = getPDASync(publicKey)
      if (anchorProgram && possibleTallyDownPDA) {
        setProgram(anchorProgram)
        setTallyDownPDA(possibleTallyDownPDA)
      }
    }
  }, [connection, program, publicKey, wallet])

  const getProgramState = useCallback(async () => {
    if (program !== null && tallyDownPDA && publicKey) {
      const programState = await getTallyDownProgramStateOrInit(
        program,
        tallyDownPDA,
        publicKey,
      )
      return programState
    }
    return null
  }, [program, publicKey, tallyDownPDA])

  const sendToke = useCallback(async () => {
    if (program !== null && tallyDownPDA && publicKey) {
      const tx = await sendTokeTransaction(program, tallyDownPDA, publicKey)
      if (tx) {
        return await getProgramState()
      }
    }
    return null
  }, [getProgramState, program, publicKey, tallyDownPDA])

  const sendResetDay = useCallback(async () => {
    if (program !== null && tallyDownPDA && publicKey) {
      const tx = await sendResetDayTransaction(program, tallyDownPDA, publicKey)
      if (tx) {
        return await getProgramState()
      }
    }
    return null
  }, [getProgramState, program, publicKey, tallyDownPDA])

  const backfillTokes = useCallback(
    async (oldTokes: Tokes[]) => {
      if (program !== null && tallyDownPDA && publicKey) {
        const tx = await sendBackfillTokesTransaction(
          program,
          tallyDownPDA,
          publicKey,
          oldTokes,
        )
        if (tx) {
          return await getProgramState()
        }
      }
      return null
    },
    [getProgramState, program, publicKey, tallyDownPDA],
  )

  useEffect(() => {
    const getInitialState = async () => {
      if (
        program !== null &&
        tallyDownPDA &&
        publicKey &&
        !initialProgramState
      ) {
        const programState = await getProgramState()
        if (programState) {
          setInitialProgramState(programState)
        }
      }
    }
    getInitialState()
  }, [program, tallyDownPDA, publicKey, initialProgramState, getProgramState])

  const value = useMemo(
    () => ({
      program,
      tallyDownPDA,
      getProgramState,
      sendToke,
      initialProgramState,
      backfillTokes,
      sendResetDay,
    }),
    [
      getProgramState,
      program,
      tallyDownPDA,
      sendToke,
      initialProgramState,
      backfillTokes,
      sendResetDay,
    ],
  )

  return (
    <TallyDownProgramContext.Provider value={value}>
      {children}
    </TallyDownProgramContext.Provider>
  )
}

export const useTallyDownProgram = () => {
  const tallyDownContext = useContext(TallyDownProgramContext)
  return { ...tallyDownContext }
}
