import { Inter, Delicious_Handrawn } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const handrawn = Delicious_Handrawn({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
})

export { inter, handrawn }
