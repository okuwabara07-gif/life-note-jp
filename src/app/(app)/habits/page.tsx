'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const supabase = createClient()
const ICONS = ['✅','🏃','📚','💧','🧘','🍎','💪','🌅','✍️','🎯','😴','🚴']

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([])
  const [logs, setLogs] = useState<Record<string,string[]>>({})
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('✅')
  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  useEffect(()=>{load()},[])

  async function load() {
    const {data:{user}} = await supabase.auth.getUser()
    if(!user) return
    const past30 = new Date(Date.now()-30*86400000).toISOString().split('T')[0]
    const [{data:h},{data:l}] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id',user.id).order('created_at'),
      supabase.from('habit_logs').select('habit_id,date').eq('user_id',user.id).gte('date',past30)
    ])
    setHabits(h??[])
    const map:Record<string,string[]>={}
    for(const log of l??[]){ map[log.habit_id]=[...(map[log.habit_id]??[]),log.date] }
    setLogs(map)
  }

  function getStreak(habitId:string) {
    const dates = new Set(logs[habitId]??[])
    let streak=0
    const d=new Date()
    while(true){
      const s=d.toISOString().split('T')[0]
      if(!dates.has(s)) break
      streak++
      d.setDate(d.getDate()-1)
    }
    return streak
  }

  function isDoneToday(habitId:string){ return (logs[habitId]??[]).includes(today) }

  async function toggleHabit(habitId:string) {
    const {data:{user}} = await supabase.auth.getUser()
    if(!user) return
    const done = isDoneToday(habitId)
    if(done){
      await supabase.from('habit_logs').delete().eq('habit_id',habitId).eq('date',today)
      setLogs(prev=>({...prev,[habitId]:(prev[habitId]??[]).filter(d=>d!==today)}))
    } else {
      await supabase.from('habit_logs').insert({habit_id:habitId,user_id:user.id,date:today})
      setLogs(prev=>({...prev,[habitId]:[...(prev[habitId]??[]),today]}))
    }
  }

  async function addHabit() {
    if(!name.trim()) return
    setLoading(true)
    const {data:{user}} = await supabase.auth.getUser()
    await supabase.from('habits').insert({user_id:user!.id,name:name.trim(),icon})
    setName('');setIcon('✅');setShowForm(false);setLoading(false);load()
  }

  async function deleteHabit(id:string) {
    if(!confirm('この習慣を削除しますか？')) return
    await supabase.from('habits').delete().eq('id',id)
    setHabits(prev=>prev.filter(h=>h.id!==id))
  }

  const doneCount = habits.filter(h=>isDoneToday(h.id)).length
  const totalCount = habits.length

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0'}}>

      {/* ヒーロー画像 */}
      <div style={{position:'relative',width:'100%',height:'160px',overflow:'hidden'}}>
        <Image
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80"
          alt="習慣トラッカー"
          fill
          style={{objectFit:'cover',objectPosition:'center 30%'}}
        />
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)'}} />
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'1rem'}}>
          <h1 style={{fontSize:'1.25rem',fontWeight:700,color:'#fff',margin:'0 0 2px'}}>習慣トラッカー</h1>
          {totalCount>0&&<p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.75)',margin:0}}>今日 {doneCount}/{totalCount} 完了</p>}
        </div>
      </div>

      <div style={{padding:'1rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <button onClick={()=>setShowForm(true)} style={{background:'#fbbf24',color:'#fff',borderRadius:'50%',width:'36px',height:'36px',border:'none',fontSize:'1.25rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
      </div>
      {totalCount>0&&(
        <div style={{height:'8px',background:'#f5f5f4',borderRadius:'9999px',overflow:'hidden'}}>
          <div style={{height:'100%',background:'#fbbf24',borderRadius:'9999px',width:`${Math.round((doneCount/totalCount)*100)}%`,transition:'width 0.5s'}} />
        </div>
      )}
      {showForm&&(
        <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          <p style={{fontSize:'0.875rem',fontWeight:500,color:'#44403c'}}>新しい習慣</p>
          <input className="input-warm" type="text" placeholder="習慣名（例：朝の体重記録）" value={name} onChange={e=>setName(e.target.value)} />
          <div>
            <p style={{fontSize:'0.75rem',color:'#a8a29e',marginBottom:'0.5rem'}}>アイコンを選ぶ</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
              {ICONS.map(ic=>(
                <button key={ic} onClick={()=>setIcon(ic)} style={{width:'36px',height:'36px',borderRadius:'0.75rem',fontSize:'1.125rem',display:'flex',alignItems:'center',justifyContent:'center',border:icon===ic?'2px solid #fbbf24':'1px solid #f5f5f4',background:icon===ic?'#fef3c7':'#fafaf9',cursor:'pointer'}}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button className="btn-secondary" style={{flex:1}} onClick={()=>setShowForm(false)}>キャンセル</button>
            <button className="btn-primary" style={{flex:1}} onClick={addHabit} disabled={loading}>{loading?'保存中...':'追加'}</button>
          </div>
        </div>
      )}
      <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        {habits.map(h=>{
          const done=isDoneToday(h.id)
          const streak=getStreak(h.id)
          const last7=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return d.toISOString().split('T')[0]})
          return (
            <div key={h.id} className="card" style={{display:'flex',alignItems:'center',gap:'0.75rem',background:done?'#fffbeb':'#fff',borderColor:done?'#fef3c7':'#f5f5f4'}}>
              <button onClick={()=>toggleHabit(h.id)} style={{width:'28px',height:'28px',borderRadius:'50%',border:`2px solid ${done?'#22c55e':'#d6d3d1'}`,background:done?'#22c55e':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'pointer',transform:done?'scale(1.1)':'scale(1)',transition:'all 0.15s'}}>
                {done&&<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
              </button>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{fontSize:'1rem'}}>{h.icon}</span>
                  <span style={{fontSize:'0.875rem',fontWeight:500,color:done?'#a8a29e':'#1c1917',textDecoration:done?'line-through':'none'}}>{h.name}</span>
                  {streak>0&&<span className="streak-badge">🔥 {streak}日</span>}
                </div>
                <div style={{display:'flex',gap:'4px',marginTop:'6px'}}>
                  {last7.map(d=>(
                    <div key={d} style={{width:'16px',height:'16px',borderRadius:'3px',background:(logs[h.id]??[]).includes(d)?'#4ade80':'#f5f5f4'}} />
                  ))}
                </div>
              </div>
              <button onClick={()=>deleteHabit(h.id)} style={{color:'#e7e5e4',fontSize:'0.75rem',background:'none',border:'none',cursor:'pointer',flexShrink:0}}>✕</button>
            </div>
          )
        })}
        {habits.length===0&&!showForm&&(
          <div style={{textAlign:'center',padding:'3rem 0'}}>
            <p style={{fontSize:'2rem',marginBottom:'0.75rem'}}>🌱</p>
            <p style={{fontSize:'0.875rem',fontWeight:500,color:'#44403c',marginBottom:'0.25rem'}}>習慣をはじめよう</p>
            <p style={{fontSize:'0.75rem',color:'#a8a29e',marginBottom:'1rem'}}>小さな積み重ねが大きな変化を生む</p>
            <button onClick={()=>setShowForm(true)} style={{background:'#f5f5f4',color:'#44403c',borderRadius:'0.75rem',padding:'0.5rem 1.5rem',fontSize:'0.875rem',fontWeight:500,border:'none',cursor:'pointer'}}>最初の習慣を追加</button>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
