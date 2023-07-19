import './globals.css'
require('@solana/wallet-adapter-react-ui/styles.css')
import { inter } from '@/lib/fonts'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Tally Down',
  description: 'Tally tool to try to reduce your smoke puff count.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
