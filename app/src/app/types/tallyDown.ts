import { BN } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'

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
