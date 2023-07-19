'use client'

import TallieTokes from '@/app/components/tallieTokes'
import Header from '@/app/components/header'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-8 md:p-24">
      <Header />
      <TallieTokes />
    </main>
  )
}
