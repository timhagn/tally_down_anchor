'use client'

import dynamic from 'next/dynamic'
import React, { FC, PropsWithChildren, useMemo } from 'react'
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import {
  WalletDisconnectButton,
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false },
)

interface WalletConnectionProviderProps extends PropsWithChildren {
  walletButtonWrapperClassName?: string
}

const WalletConnectionProvider: FC<WalletConnectionProviderProps> = ({
  walletButtonWrapperClassName,
  children,
}) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  )
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletConnectedSwitch>
            <div className={walletButtonWrapperClassName}>
              <WalletMultiButtonDynamic />
            </div>
            {children}
          </WalletConnectedSwitch>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export function WalletConnectedSwitch({ children }: PropsWithChildren) {
  const { connected } = useWallet()
  if (!connected) {
    return <WalletMultiButtonDynamic />
  }
  return <>{children}</>
}

export default WalletConnectionProvider
