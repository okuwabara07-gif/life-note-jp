'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'ホーム' },
  { href: '/kakeibo', icon: '💰', label: '家計簿' },
  { href: '/habits', icon: '✅', label: '習慣' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#fff',borderTop:'1px solid #f5f5f4'}}>
      <div style={{maxWidth:'448px',margin:'0 auto',display:'flex'}}>
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'0.75rem 0',gap:'0.125rem',textDecoration:'none'}}>
              <span style={{fontSize:'1.25rem'}}>{item.icon}</span>
              <span style={{fontSize:'0.75rem',fontWeight:500,color:active?'#d97706':'#a8a29e'}}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
