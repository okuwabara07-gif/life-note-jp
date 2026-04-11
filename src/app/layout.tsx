import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LifeNote — お金と習慣を、やさしく続ける',
  description: 'AI家計簿と習慣トラッカーで、毎日をちょっと豊かに。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
