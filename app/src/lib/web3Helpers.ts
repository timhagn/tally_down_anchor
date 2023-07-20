import { AnchorWallet } from '@solana/wallet-adapter-react'
import { ConfirmOptions, Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider, Idl, utils } from '@coral-xyz/anchor'
import idl from '../../../target/idl/tally_down.json'

const opts: ConfirmOptions = {
  preflightCommitment: 'processed',
}
const programID = new PublicKey(idl.metadata.address)

export const getProgram = (connection: Connection, wallet: AnchorWallet) => {
  const provider = new AnchorProvider(connection, wallet, opts)
  const program = new Program(idl as Idl, programID, provider)
  return program
}

export const getPDASync = (publicKey: PublicKey) => {
  const [tallyDownPDA, _] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode('tally-down'), publicKey.toBuffer()],
    programID,
  )
  return tallyDownPDA
}
