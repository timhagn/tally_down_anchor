import TallieTokes from '@/app/components/tallieTokes'
import Header from '@/app/components/header'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <Header />
      <TallieTokes />
    </main>
  )
}
