import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'おはよう'
  if (h < 18) return 'こんにちは'
  return 'おかえり'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('name,monthly_budget').eq('id', user!.id).single()
  const now = new Date()
  const monthStart = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`
  const today = now.toISOString().split('T')[0]
  const { data: txns } = await supabase.from('transactions').select('amount,type').eq('user_id', user!.id).gte('date', monthStart)
  const income = txns?.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0)??0
  const expense = txns?.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)??0
  const balance = income - expense
  const budget = profile?.monthly_budget??200000
  const spentPct = Math.min(Math.round((expense/budget)*100),100)
  const { data: habits } = await supabase.from('habits').select('id,name,icon').eq('user_id', user!.id)
  const { data: todayLogs } = await supabase.from('habit_logs').select('habit_id').eq('user_id', user!.id).eq('date', today)
  const doneIds = new Set(todayLogs?.map(l=>l.habit_id)??[])
  const { data: recentTxns } = await supabase.from('transactions').select('id,amount,type,note,date,category:categories(name,icon)').eq('user_id', user!.id).order('created_at',{ascending:false}).limit(3)
  const name = profile?.name??'あなた'
  const habitDone = doneIds.size
  const habitTotal = habits?.length??0

  return (
    <div style={{padding:'1.5rem 1rem 0',display:'flex',flexDirection:'column',gap:'1rem'}}>
      <div>
        <p style={{fontSize:'0.875rem',color:'#78716c'}}>{greeting()}、</p>
        <h1 style={{fontSize:'1.5rem',fontWeight:700,color:'#1c1917'}}>{name}さん</h1>
      </div>
      <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <p style={{fontSize:'0.75rem',color:'#a8a29e',fontWeight:500}}>今月の残高</p>
            <p style={{fontSize:'1.875rem',fontWeight:700,letterSpacing:'-0.05em',color:balance>=0?'#1c1917':'#dc2626'}}>¥{balance.toLocaleString()}</p>
          </div>
          <span style={{fontSize:'0.75rem',padding:'0.25rem 0.5rem',borderRadius:'9999px',fontWeight:500,background:spentPct>=90?'#fef2f2':spentPct>=70?'#fef3c7':'#f0fdf4',color:spentPct>=90?'#dc2626':spentPct>=70?'#92400e':'#166534'}}>予算の{spentPct}%</span>
        </div>
        <div style={{display:'flex',gap:'1rem'}}>
          <div><p style={{fontSize:'0.75rem',color:'#a8a29e'}}>収入</p><p style={{fontSize:'1rem',fontWeight:600,color:'#16a34a'}}>+¥{income.toLocaleString()}</p></div>
          <div><p style={{fontSize:'0.75rem',color:'#a8a29e'}}>支出</p><p style={{fontSize:'1rem',fontWeight:600,color:'#dc2626'}}>-¥{expense.toLocaleString()}</p></div>
        </div>
        <div style={{height:'6px',background:'#f5f5f4',borderRadius:'9999px',overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:'9999px',width:`${spentPct}%`,background:spentPct>=90?'#f87171':spentPct>=70?'#fbbf24':'#4ade80'}} />
        </div>
      </div>
      {habitTotal>0&&(
        <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <p style={{fontSize:'0.875rem',fontWeight:500,color:'#44403c'}}>今日の習慣</p>
            <span style={{fontSize:'0.75rem',color:'#a8a29e'}}>{habitDone}/{habitTotal}</span>
          </div>
          {habits!.slice(0,4).map((h:any)=>(
            <div key={h.id} style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <div style={{width:'20px',height:'20px',borderRadius:'50%',border:`2px solid ${doneIds.has(h.id)?'#22c55e':'#d6d3d1'}`,background:doneIds.has(h.id)?'#22c55e':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {doneIds.has(h.id)&&<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none"/></svg>}
              </div>
              <span style={{fontSize:'0.875rem',color:'#44403c'}}>{h.icon} {h.name}</span>
            </div>
          ))}
          <Link href="/habits" style={{textAlign:'center',fontSize:'0.75rem',color:'#d97706',fontWeight:500,textDecoration:'none'}}>すべての習慣を見る →</Link>
        </div>
      )}
      {recentTxns&&recentTxns.length>0&&(
        <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          <p style={{fontSize:'0.875rem',fontWeight:500,color:'#44403c'}}>最近の記録</p>
          {recentTxns.map((t:any)=>(
            <div key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.25rem 0'}}>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <span style={{fontSize:'1.125rem'}}>{t.category?.icon??'📝'}</span>
                <div>
                  <p style={{fontSize:'0.875rem',color:'#1c1917'}}>{t.note||t.category?.name||'記録'}</p>
                  <p style={{fontSize:'0.75rem',color:'#a8a29e'}}>{t.date}</p>
                </div>
              </div>
              <span style={{fontSize:'0.875rem',fontWeight:600,color:t.type==='income'?'#16a34a':'#dc2626'}}>{t.type==='income'?'+':'-'}¥{t.amount.toLocaleString()}</span>
            </div>
          ))}
          <Link href="/kakeibo" style={{textAlign:'center',fontSize:'0.75rem',color:'#d97706',fontWeight:500,textDecoration:'none'}}>家計簿を開く →</Link>
        </div>
      )}
      {habitTotal===0&&(
        <div className="card" style={{textAlign:'center',padding:'2rem 1rem'}}>
          <p style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>✨</p>
          <p style={{fontSize:'0.875rem',fontWeight:500,color:'#44403c',marginBottom:'0.25rem'}}>習慣を設定しましょう</p>
          <p style={{fontSize:'0.75rem',color:'#a8a29e',marginBottom:'0.75rem'}}>毎日続けたいことを登録して、ストリークを伸ばそう</p>
          <Link href="/habits" style={{display:'inline-block',background:'#f5f5f4',color:'#44403c',borderRadius:'0.75rem',padding:'0.5rem 1.5rem',fontSize:'0.875rem',fontWeight:500,textDecoration:'none'}}>習慣を追加する</Link>
        </div>
      )}
    </div>
  )
}
