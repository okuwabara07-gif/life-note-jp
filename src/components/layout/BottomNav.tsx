'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'ホーム', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3l9 9" stroke={active?'#1c1917':'#c8c4bd'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9" stroke={active?'#1c1917':'#c8c4bd'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { href: '/kakeibo', label: '家計簿', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke={active?'#1c1917':'#c8c4bd'} strokeWidth="2"/>
      <path d="M2 10h20" stroke={active?'#1c1917':'#c8c4bd'} strokeWidth="2"/>
      <circle cx="8" cy="15" r="1.5" fill={active?'#1c1917':'#c8c4bd'}/>
    </svg>
  )},
  { href: '/habits', label: '習慣', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active?'#1c1917':'#c8c4bd'} strokeWidth="2"/>
      <path d="M8 12l3 3 5-5" stroke={active?'#1c1917':'#c8c4bd'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { href: '/settings', label: '設定', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={active?'#1c1917':'#c8c4bd'} strokeWidth="2"/>
      <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={active?'#1c1917':'#c8c4bd'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )},
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [fabOpen, setFabOpen] = useState(false)

  return (
    <>
      {fabOpen && (
        <div
          onClick={() => setFabOpen(false)}
          style={{position:'fixed',inset:0,zIndex:40}}
        />
      )}
      {fabOpen && (
        <div style={{position:'fixed',bottom:'5.5rem',left:'50%',transform:'translateX(-50%)',zIndex:50,display:'flex',flexDirection:'column',gap:'8px',alignItems:'center'}}>
          {[
            { href: '/kakeibo?add=expense', label: '支出を記録', color: '#fef2f2', textColor: '#dc2626' },
            { href: '/kakeibo?add=income', label: '収入を記録', color: '#f0fdf4', textColor: '#16a34a' },
            { href: '/habits', label: '習慣チェック', color: '#fef3c7', textColor: '#92400e' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setFabOpen(false)}
              style={{
                display:'flex',alignItems:'center',gap:'8px',
                background:item.color,color:item.textColor,
                padding:'10px 20px',borderRadius:'9999px',
                fontSize:'0.875rem',fontWeight:500,textDecoration:'none',
                border:`1px solid ${item.textColor}22`,
                whiteSpace:'nowrap',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#fff',borderTop:'1px solid #f0ede8',zIndex:30}}>
        <div style={{maxWidth:'448px',margin:'0 auto',display:'flex',alignItems:'center'}}>
          {navItems.slice(0,2).map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'0.625rem 0 0.5rem',gap:'2px',textDecoration:'none'}}>
                {item.icon(active)}
                <span style={{fontSize:'0.625rem',fontWeight:500,color:active?'#1c1917':'#a8a29e'}}>{item.label}</span>
              </Link>
            )
          })}

          <div style={{flex:1,display:'flex',justifyContent:'center',paddingBottom:'4px'}}>
            <button
              onClick={() => setFabOpen(v => !v)}
              style={{
                width:'48px',height:'48px',borderRadius:'50%',
                background: fabOpen ? '#44403c' : '#1c1917',
                border:'none',cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',
                transition:'transform 0.2s',
                transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {navItems.slice(2).map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'0.625rem 0 0.5rem',gap:'2px',textDecoration:'none'}}>
                {item.icon(active)}
                <span style={{fontSize:'0.625rem',fontWeight:500,color:active?'#1c1917':'#a8a29e'}}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
