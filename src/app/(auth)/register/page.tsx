'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleRegister() {
    if (!name || !email || !password) { setError('すべて入力してください'); return }
    if (password.length < 8) { setError('パスワードは8文字以上'); return }
    setLoading(true)
    setError('')
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 1.5rem',background:'#fafaf9'}}>
      <div style={{width:'100%',maxWidth:'384px'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{fontSize:'3rem',marginBottom:'0.5rem'}}>📒</div>
          <h1 style={{fontSize:'1.5rem',fontWeight:700,color:'#1c1917'}}>はじめましょう</h1>
          <p style={{fontSize:'0.875rem',color:'#78716c',marginTop:'0.25rem'}}>無料で始めて、毎日を記録する</p>
        </div>
        <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {error && <p style={{fontSize:'0.75rem',color:'#dc2626',background:'#fef2f2',padding:'0.75rem',borderRadius:'0.5rem'}}>{error}</p>}
          <input className="input-warm" type="text" placeholder="ニックネーム" value={name} onChange={e => setName(e.target.value)} />
          <input className="input-warm" type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input-warm" type="password" placeholder="パスワード（8文字以上）" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn-primary" onClick={handleRegister} disabled={loading}>
            {loading ? '登録中...' : '無料で始める'}
          </button>
          <p style={{textAlign:'center',fontSize:'0.75rem',color:'#a8a29e'}}>登録することで利用規約に同意したことになります</p>
        </div>
        <p style={{textAlign:'center',fontSize:'0.875rem',color:'#78716c',marginTop:'1rem'}}>
          アカウントをお持ちの方は{' '}
          <Link href="/login" style={{color:'#d97706',fontWeight:500}}>ログイン</Link>
        </p>
      </div>
    </div>
  )
}
