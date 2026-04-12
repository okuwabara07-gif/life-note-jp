'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => { load() }, [])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setEmail(user.email ?? '')
    const { data } = await supabase.from('profiles').select('name,monthly_budget').eq('id', user.id).single()
    if (data) {
      setName(data.name ?? '')
      setBudget(data.monthly_budget ? String(data.monthly_budget) : '')
    }
  }

  async function save() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({
      name: name.trim(),
      monthly_budget: budget ? parseInt(budget) : null,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function logout() {
    if (!confirm('ログアウトしますか？')) return
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{padding:'1.5rem 1rem 0',display:'flex',flexDirection:'column',gap:'1rem'}}>
      <h1 style={{fontSize:'1.25rem',fontWeight:700,color:'#1c1917',margin:0}}>設定</h1>

      <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        <p style={{fontSize:'0.875rem',fontWeight:600,color:'#44403c',margin:'0 0 4px'}}>プロフィール</p>
        <div>
          <p style={{fontSize:'0.75rem',color:'#a8a29e',margin:'0 0 4px'}}>ニックネーム</p>
          <input
            className="input-warm"
            type="text"
            placeholder="名前を入力"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <p style={{fontSize:'0.75rem',color:'#a8a29e',margin:'0 0 4px'}}>メールアドレス</p>
          <input
            className="input-warm"
            type="email"
            value={email}
            disabled
            style={{opacity:0.6,cursor:'not-allowed'}}
          />
        </div>
      </div>

      <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        <p style={{fontSize:'0.875rem',fontWeight:600,color:'#44403c',margin:'0 0 4px'}}>家計簿設定</p>
        <div>
          <p style={{fontSize:'0.75rem',color:'#a8a29e',margin:'0 0 4px'}}>月の予算</p>
          <div style={{position:'relative'}}>
            <span style={{position:'absolute',left:'0.75rem',top:'50%',transform:'translateY(-50%)',color:'#a8a29e',fontSize:'0.875rem'}}>¥</span>
            <input
              className="input-warm"
              type="number"
              placeholder="200000"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              style={{paddingLeft:'1.5rem'}}
            />
          </div>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={save}
        disabled={loading}
        style={{background: saved ? '#16a34a' : '#1c1917'}}
      >
        {loading ? '保存中...' : saved ? '✓ 保存しました' : '変更を保存'}
      </button>

      <div style={{marginTop:'0.5rem'}}>
        <button
          onClick={logout}
          style={{
            width:'100%',padding:'0.75rem',
            background:'transparent',color:'#dc2626',
            border:'1px solid #fecaca',borderRadius:'0.75rem',
            fontSize:'0.875rem',fontWeight:500,cursor:'pointer',
          }}
        >
          ログアウト
        </button>
      </div>

      <p style={{textAlign:'center',fontSize:'0.75rem',color:'#d6d3d1',paddingBottom:'1rem'}}>
        LifeNote v0.1
      </p>
    </div>
  )
}
