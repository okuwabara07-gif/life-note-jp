'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('メールアドレスかパスワードが違います'); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 1.5rem',background:'#fafaf9'}}>
      <div style={{width:'100%',maxWidth:'384px'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{fontSize:'3rem',marginBottom:'0.5rem'}}>📒</div>
          <h1 style={{fontSize:'1.5rem',fontWeight:700,color:'#1c1917'}}>LifeNote</h1>
          <p style={{fontSize:'0.875rem',color:'#78716c',marginTop:'0.25rem'}}>お金と習慣を、やさしく続ける</p>
        </div>
        <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {error && <p style={{fontSize:'0.75rem',color:'#dc2626',background:'#fef2f2',padding:'0.75rem',borderRadius:'0.5rem'}}>{error}</p>}
          <input className="input-warm" type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input-warm" type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>
        <p style={{textAlign:'center',fontSize:'0.875rem',color:'#78716c',marginTop:'1rem'}}>
          アカウントをお持ちでない方は{' '}
          <Link href="/register" style={{color:'#d97706',fontWeight:500}}>新規登録</Link>
        </p>
      </div>
    </div>
  )
}
