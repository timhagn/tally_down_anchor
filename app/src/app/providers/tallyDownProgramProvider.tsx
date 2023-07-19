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
import { Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { getPDASync, getProgram } from '@/lib/web3Helpers'
import {
  getTallyDownProgramStateOrInit,
  sendTokeTransaction,
} from '@/lib/tallyTokeUtils'

interface TallyDownProgramContextProps {
  program: Program | null
  tallyDownPDA: PublicKey | null
  getProgramState: () => any | null
  sendToke: () => any | null
}

const TallyDownProgramContextDefaultValues: TallyDownProgramContextProps = {
  program: null,
  tallyDownPDA: null,
  getProgramState: () => {},
  sendToke: () => {},
}

export const TallyDownProgramContext: Context<TallyDownProgramContextProps> =
  createContext(TallyDownProgramContextDefaultValues)

export const TallyDownProgramProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { connection } = useConnection()
  const { publicKey, connected, sendTransaction } = useWallet()
  const wallet = useAnchorWallet() as AnchorWallet
  const [program, setProgram] = useState<Program | null>(null)
  const [tallyDownPDA, setTallyDownPDA] = useState<PublicKey | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (connected && publicKey && !program) {
      const anchorProgram = getProgram(connection, wallet)
      const possibleTallyDownPDA = getPDASync(publicKey)
      if (anchorProgram && possibleTallyDownPDA) {
        setProgram(anchorProgram)
        setTallyDownPDA(possibleTallyDownPDA)
      }
    }
  }, [connected, connection, program, publicKey, wallet])

  const getProgramState = useCallback(async () => {
    if (program && tallyDownPDA && publicKey) {
      const programState = await getTallyDownProgramStateOrInit(
        program,
        tallyDownPDA,
        publicKey,
      )
      // if (programState === true) {
      //   setInitialized(true)
      //   return null
      // }
      return programState
    }
    return null
  }, [program, publicKey, tallyDownPDA])

  const sendToke = useCallback(async () => {
    if (program && tallyDownPDA && publicKey && initialized) {
      return await sendTokeTransaction(program, tallyDownPDA, publicKey)
    }
    return null
  }, [initialized, program, publicKey, tallyDownPDA])

  const value = useMemo(
    () => ({
      program,
      tallyDownPDA,
      getProgramState,
      sendToke,
    }),
    [getProgramState, program, tallyDownPDA, sendToke],
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
