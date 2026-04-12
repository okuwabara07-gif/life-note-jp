'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setError('')
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

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

          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              display:'flex',alignItems:'center',justifyContent:'center',gap:'0.625rem',
              width:'100%',padding:'0.625rem 1rem',
              border:'1px solid #e7e5e4',borderRadius:'0.5rem',
              background:'#fff',color:'#1c1917',fontSize:'0.875rem',fontWeight:500,
              cursor:'pointer',
            }}
          >
            <GoogleIcon />
            {googleLoading ? '接続中...' : 'Googleでログイン'}
          </button>

          <div style={{display:'flex',alignItems:'center',gap:'0.75rem',margin:'0.25rem 0'}}>
            <div style={{flex:1,height:'1px',background:'#e7e5e4'}} />
            <span style={{fontSize:'0.75rem',color:'#a8a29e'}}>または</span>
            <div style={{flex:1,height:'1px',background:'#e7e5e4'}} />
          </div>

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
