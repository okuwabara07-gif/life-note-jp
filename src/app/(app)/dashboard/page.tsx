import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function greeting() {
  const h = new Date().getHours()
  if (h < 10) return 'おはようございます'
  if (h < 18) return 'こんにちは'
  return 'おかえりなさい'
}

function monthProgress() {
  const now = new Date()
  const total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const day = now.getDate()
  return { day, total, pct: Math.round((day / total) * 100) }
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
  const budget = profile?.monthly_budget ?? 200000
  const spentPct = Math.min(Math.round((expense/budget)*100), 100)
  const remainBudget = budget - expense
  const { data: habits } = await supabase.from('habits').select('id,name,icon').eq('user_id', user!.id)
  const { data: todayLogs } = await supabase.from('habit_logs').select('habit_id').eq('user_id', user!.id).eq('date', today)
  const doneIds = new Set(todayLogs?.map(l=>l.habit_id)??[])
  const { data: recentTxns } = await supabase.from('transactions').select('id,amount,type,note,date,category:categories(name,icon)').eq('user_id', user!.id).order('created_at',{ascending:false}).limit(3)
  const name = profile?.name ?? 'あなた'
  const habitDone = doneIds.size
  const habitTotal = habits?.length ?? 0
  const mp = monthProgress()
  const budgetColor = spentPct >= 90 ? '#dc2626' : spentPct >= 70 ? '#d97706' : '#16a34a'
  const habitPct = habitTotal > 0 ? Math.round((habitDone / habitTotal) * 100) : 0

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0'}}>

      {/* ヘッダー */}
      <div style={{background:'#1c1917',padding:'1.5rem 1rem 1.25rem'}}>
        <p style={{fontSize:'0.8125rem',color:'rgba(255,255,255,0.6)',margin:'0 0 2px'}}>{greeting()}</p>
        <h1 style={{fontSize:'1.375rem',fontWeight:700,color:'#fff',margin:'0 0 1rem',letterSpacing:'-0.02em'}}>{name}さん</h1>

        {/* 月進捗バー */}
        <div style={{marginBottom:'0.875rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
            <span style={{fontSize:'0.6875rem',color:'rgba(255,255,255,0.5)'}}>4月の進捗</span>
            <span style={{fontSize:'0.6875rem',color:'rgba(255,255,255,0.5)'}}>{mp.day}日 / {mp.total}日</span>
          </div>
          <div style={{height:'4px',background:'rgba(255,255,255,0.15)',borderRadius:'2px',overflow:'hidden'}}>
            <div style={{height:'100%',background:'rgba(255,255,255,0.7)',borderRadius:'2px',width:`${mp.pct}%`}} />
          </div>
        </div>

        {/* 残高ビッグナンバー */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div>
            <p style={{fontSize:'0.6875rem',color:'rgba(255,255,255,0.5)',margin:'0 0 2px'}}>今月の残高</p>
            <p style={{fontSize:'2rem',fontWeight:700,color: balance>=0 ? '#fff' : '#f87171',margin:0,letterSpacing:'-0.04em'}}>
              ¥{balance.toLocaleString()}
            </p>
          </div>
          <div style={{textAlign:'right'}}>
            <p style={{fontSize:'0.6875rem',color:'rgba(255,255,255,0.5)',margin:'0 0 2px'}}>予算残</p>
            <p style={{fontSize:'1rem',fontWeight:600,color: remainBudget >= 0 ? '#4ade80' : '#f87171',margin:0}}>
              ¥{remainBudget.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* サマリーグリッド */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',background:'#f0ede8',borderBottom:'1px solid #f0ede8'}}>
        <div style={{background:'#fff',padding:'0.875rem 1rem'}}>
          <p style={{fontSize:'0.6875rem',color:'#a8a29e',margin:'0 0 3px'}}>収入</p>
          <p style={{fontSize:'1rem',fontWeight:600,color:'#16a34a',margin:0}}>+¥{income.toLocaleString()}</p>
        </div>
        <div style={{background:'#fff',padding:'0.875rem 1rem'}}>
          <p style={{fontSize:'0.6875rem',color:'#a8a29e',margin:'0 0 3px'}}>支出</p>
          <p style={{fontSize:'1rem',fontWeight:600,color:'#dc2626',margin:0}}>-¥{expense.toLocaleString()}</p>
        </div>
        <div style={{background:'#fff',padding:'0.875rem 1rem'}}>
          <p style={{fontSize:'0.6875rem',color:'#a8a29e',margin:'0 0 3px'}}>予算使用率</p>
          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
            <p style={{fontSize:'1rem',fontWeight:600,color:budgetColor,margin:0}}>{spentPct}%</p>
            <div style={{flex:1,height:'4px',background:'#f5f5f4',borderRadius:'2px',overflow:'hidden'}}>
              <div style={{height:'100%',background:budgetColor,borderRadius:'2px',width:`${spentPct}%`}} />
            </div>
          </div>
        </div>
        <div style={{background:'#fff',padding:'0.875rem 1rem'}}>
          <p style={{fontSize:'0.6875rem',color:'#a8a29e',margin:'0 0 3px'}}>今日の習慣</p>
          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
            <p style={{fontSize:'1rem',fontWeight:600,color: habitPct===100 ? '#16a34a' : '#1c1917',margin:0}}>{habitDone}/{habitTotal}</p>
            {habitPct === 100 && <span style={{fontSize:'0.75rem'}}>🎉</span>}
          </div>
        </div>
      </div>

      <div style={{padding:'1rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>

        {/* 今日の習慣カード */}
        {habitTotal > 0 && (
          <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <p style={{fontSize:'0.875rem',fontWeight:600,color:'#1c1917',margin:0}}>今日の習慣</p>
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <div style={{height:'4px',width:'60px',background:'#f5f5f4',borderRadius:'2px',overflow:'hidden'}}>
                  <div style={{height:'100%',background: habitPct===100 ? '#22c55e' : '#fbbf24',borderRadius:'2px',width:`${habitPct}%`,transition:'width 0.5s'}} />
                </div>
                <span style={{fontSize:'0.6875rem',color:'#a8a29e'}}>{habitDone}/{habitTotal}</span>
              </div>
            </div>
            {habits!.slice(0,5).map((h:any) => (
              <div key={h.id} style={{display:'flex',alignItems:'center',gap:'0.625rem'}}>
                <div style={{width:'22px',height:'22px',borderRadius:'50%',border:`2px solid ${doneIds.has(h.id)?'#22c55e':'#e7e5e4'}`,background:doneIds.has(h.id)?'#22c55e':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {doneIds.has(h.id) && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                </div>
                <span style={{fontSize:'0.8125rem',color: doneIds.has(h.id) ? '#a8a29e' : '#44403c',textDecoration: doneIds.has(h.id) ? 'line-through' : 'none',flex:1}}>
                  {h.icon} {h.name}
                </span>
              </div>
            ))}
            <Link href="/habits" style={{textAlign:'center',fontSize:'0.75rem',color:'#d97706',fontWeight:500,textDecoration:'none',paddingTop:'2px'}}>
              習慣ページで記録する →
            </Link>
          </div>
        )}

        {/* 最近の支出 */}
        {recentTxns && recentTxns.length > 0 && (
          <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2px'}}>
              <p style={{fontSize:'0.875rem',fontWeight:600,color:'#1c1917',margin:0}}>最近の記録</p>
              <Link href="/kakeibo" style={{fontSize:'0.75rem',color:'#d97706',fontWeight:500,textDecoration:'none'}}>すべて見る</Link>
            </div>
            {recentTxns.map((t:any) => (
              <div key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.375rem 0',borderBottom:'1px solid #fafaf9'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{fontSize:'1.125rem'}}>{(t.category as any)?.icon ?? '📝'}</span>
                  <div>
                    <p style={{fontSize:'0.8125rem',color:'#1c1917',margin:0}}>{t.note || (t.category as any)?.name || '記録'}</p>
                    <p style={{fontSize:'0.6875rem',color:'#a8a29e',margin:0}}>{t.date}</p>
                  </div>
                </div>
                <span style={{fontSize:'0.875rem',fontWeight:600,color:t.type==='income'?'#16a34a':'#dc2626'}}>
                  {t.type==='income'?'+':'-'}¥{t.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 習慣ゼロ状態 */}
        {habitTotal === 0 && (
          <div className="card" style={{textAlign:'center',padding:'2rem 1rem'}}>
            <p style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>✨</p>
            <p style={{fontSize:'0.875rem',fontWeight:500,color:'#44403c',marginBottom:'0.25rem'}}>習慣を設定しましょう</p>
            <p style={{fontSize:'0.75rem',color:'#a8a29e',marginBottom:'0.75rem'}}>毎日続けたいことを登録して、ストリークを伸ばそう</p>
            <Link href="/habits" style={{display:'inline-block',background:'#f5f5f4',color:'#44403c',borderRadius:'0.75rem',padding:'0.5rem 1.5rem',fontSize:'0.875rem',fontWeight:500,textDecoration:'none'}}>
              習慣を追加する
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
