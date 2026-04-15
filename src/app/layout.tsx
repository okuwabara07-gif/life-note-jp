import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LifeNote — お金と習慣を、やさしく続ける',
  description: 'AI家計簿と習慣トラッカーで、毎日をちょっと豊かに。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="google-site-verification" content="xpdiFRYHloMJxfhCT-IMD08p5na4v9WUqvPY9OrDsHs" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3460729726810386"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
