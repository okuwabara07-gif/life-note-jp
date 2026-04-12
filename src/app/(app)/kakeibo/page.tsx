'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const supabase = createClient()

export default function KakeiboPage() {
  const [txns, setTxns] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<'expense'|'income'>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{load()},[])

  async function load() {
    const {data:{user}} = await supabase.auth.getUser()
    if(!user) return
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`
    const [{data:t},{data:c}] = await Promise.all([
      supabase.from('transactions').select('*,category:categories(*)').eq('user_id',user.id).gte('date',monthStart).order('date',{ascending:false}).order('created_at',{ascending:false}),
      supabase.from('categories').select('*').eq('user_id',user.id)
    ])
    setTxns(t??[])
    setCategories(c??[])
    if(c&&c.length>0) setCategoryId(c.find((x:any)=>x.type==='expense')?.id??c[0].id)
  }

  async function addTxn() {
    if(!amount||!categoryId) return
    setLoading(true)
    const {data:{user}} = await supabase.auth.getUser()
    await supabase.from('transactions').insert({user_id:user!.id,amount:parseInt(amount),type,category_id:categoryId,note:note||null,date})
    setAmount('');setNote('');setShowForm(false);setLoading(false);load()
  }

  async function deleteTxn(id:string) {
    await supabase.from('transactions').delete().eq('id',id)
    setTxns(prev=>prev.filter(t=>t.id!==id))
  }

  const income = txns.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0)
  const expense = txns.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)
  const filteredCats = categories.filter(c=>c.type===type)
  const grouped = txns.reduce((acc:any,t)=>{acc[t.date]=[...(acc[t.date]??[]),t];return acc},{})

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0'}}>

      {/* ヒーロー画像 */}
      <div style={{position:'relative',width:'100%',height:'160px',overflow:'hidden'}}>
        <Image
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80"
          alt="家計簿・お金の管理"
          fill
          style={{objectFit:'cover',objectPosition:'center 40%'}}
        />
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)'}} />
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
            <h1 style={{fontSize:'1.25rem',fontWeight:700,color:'#fff',margin:0}}>家計簿</h1>
            <button onClick={()=>setShowForm(true)} style={{background:'#fbbf24',color:'#fff',borderRadius:'50%',width:'36px',height:'36px',border:'none',fontSize:'1.25rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
          </div>
        </div>
      </div>

    <div style={{padding:'1rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.5rem'}}>
        {[{label:'収入',val:income,color:'#16a34a'},{label:'支出',val:expense,color:'#dc2626'},{label:'収支',val:income-expense,color:income-expense>=0?'#1c1917':'#dc2626'}].map(m=>(
          <div key={m.label} className="card" style={{textAlign:'center',padding:'0.75rem'}}>
            <p style={{fontSize:'0.75rem',color:'#a8a29e',marginBottom:'0.25rem'}}>{m.label}</p>
            <p style={{fontSize:'0.875rem',fontWeight:700,color:m.color}}>¥{m.val.toLocaleString()}</p>
          </div>
        ))}
      </div>
      {showForm&&(
        <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          <div style={{display:'flex',gap:'0.5rem'}}>
            {(['expense','income'] as const).map(t=>(
              <button key={t} onClick={()=>{setType(t);setCategoryId(categories.find((c:any)=>c.type===t)?.id??'')}} style={{flex:1,padding:'0.5rem',borderRadius:'0.75rem',fontSize:'0.875rem',fontWeight:500,border:'none',cursor:'pointer',background:type===t?(t==='expense'?'#fef2f2':'#f0fdf4'):'#fafaf9',color:type===t?(t==='expense'?'#dc2626':'#16a34a'):'#a8a29e'}}>
                {t==='expense'?'支出':'収入'}
              </button>
            ))}
          </div>
          <input className="input-warm" style={{fontSize:'1.25rem',fontWeight:700}} type="number" placeholder="金額" value={amount} onChange={e=>setAmount(e.target.value)} />
          <select className="input-warm" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
            {filteredCats.map((c:any)=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <input className="input-warm" type="text" placeholder="メモ（任意）" value={note} onChange={e=>setNote(e.target.value)} />
          <input className="input-warm" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button className="btn-secondary" style={{flex:1}} onClick={()=>setShowForm(false)}>キャンセル</button>
            <button className="btn-primary" style={{flex:1}} onClick={addTxn} disabled={loading}>{loading?'保存中...':'保存'}</button>
          </div>
        </div>
      )}
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {Object.entries(grouped).map(([d,list]:any)=>(
          <div key={d}>
            <p style={{fontSize:'0.75rem',color:'#a8a29e',fontWeight:500,marginBottom:'0.5rem'}}>{d}</p>
            <div className="card" style={{padding:0,overflow:'hidden'}}>
              {list.map((t:any,i:number)=>(
                <div key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.75rem 1rem',borderBottom:i<list.length-1?'1px solid #fafaf9':'none'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                    <span style={{fontSize:'1.125rem'}}>{t.category?.icon??'📝'}</span>
                    <div>
                      <p style={{fontSize:'0.875rem',color:'#1c1917'}}>{t.note||t.category?.name}</p>
                      <p style={{fontSize:'0.75rem',color:'#a8a29e'}}>{t.category?.name}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    <span style={{fontSize:'0.875rem',fontWeight:600,color:t.type==='income'?'#16a34a':'#dc2626'}}>{t.type==='income'?'+':'-'}¥{t.amount.toLocaleString()}</span>
                    <button onClick={()=>deleteTxn(t.id)} style={{color:'#d6d3d1',fontSize:'0.75rem',background:'none',border:'none',cursor:'pointer'}}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {txns.length===0&&(
          <div style={{textAlign:'center',padding:'3rem 0'}}>
            <p style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>💰</p>
            <p style={{fontSize:'0.875rem',color:'#a8a29e'}}>まだ記録がありません</p>
            <p style={{fontSize:'0.75rem',color:'#d6d3d1',marginTop:'0.25rem'}}>右上の＋から追加しよう</p>
          </div>
        )}

        {/* アフィリエイト：お金を増やすおすすめ */}
        <div style={{marginTop:'1.5rem',display:'flex',flexDirection:'column',gap:'0.625rem'}}>
          <p style={{fontSize:'0.75rem',fontWeight:500,color:'#a8a29e',letterSpacing:'0.04em'}}>お金を増やすヒント</p>

          {/* DMM FX */}
          <a href="https://px.a8.net/svt/ejp?a8mat=3Z4KXY+XXXXXX+XXXX+XXXX" rel="nofollow" target="_blank"
            style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.875rem',background:'#fff',border:'1px solid #f0ede8',borderRadius:'0.75rem',textDecoration:'none'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'0.5rem',background:'#1c1917',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{fontSize:'1.25rem'}}>📈</span>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:'0.8125rem',fontWeight:600,color:'#1c1917',margin:'0 0 2px'}}>DMM FX — 口座開設で最大30万円キャッシュバック</p>
              <p style={{fontSize:'0.6875rem',color:'#a8a29e',margin:0}}>取引コスト最安水準 · 初心者サポート充実</p>
            </div>
            <span style={{fontSize:'0.75rem',color:'#d97706',fontWeight:500,flexShrink:0}}>無料 →</span>
          </a>

          {/* 楽天証券 */}
          <a href="https://hb.afl.rakuten.co.jp/ichiba/XXXXXXXXX/?pc=https%3A%2F%2Fwww.rakuten-sec.co.jp%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwiY29sIjoxfQ%3D%3D" rel="nofollow" target="_blank"
            style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.875rem',background:'#fff',border:'1px solid #f0ede8',borderRadius:'0.75rem',textDecoration:'none'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'0.5rem',background:'#dc2626',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{fontSize:'1.25rem'}}>💹</span>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:'0.8125rem',fontWeight:600,color:'#1c1917',margin:'0 0 2px'}}>楽天証券 — NISAで資産を増やす</p>
              <p style={{fontSize:'0.6875rem',color:'#a8a29e',margin:0}}>口座開設無料 · 楽天ポイントで投資できる</p>
            </div>
            <span style={{fontSize:'0.75rem',color:'#d97706',fontWeight:500,flexShrink:0}}>無料 →</span>
          </a>

          {/* 節約系 */}
          <a href="https://px.a8.net/svt/ejp?a8mat=3Z4KXY+YYYYYY+YYYY+YYYY" rel="nofollow" target="_blank"
            style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.875rem',background:'#fff',border:'1px solid #f0ede8',borderRadius:'0.75rem',textDecoration:'none'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'0.5rem',background:'#d97706',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{fontSize:'1.25rem'}}>🏷️</span>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:'0.8125rem',fontWeight:600,color:'#1c1917',margin:'0 0 2px'}}>エネチェンジ — 電気代を今すぐ安くする</p>
              <p style={{fontSize:'0.6875rem',color:'#a8a29e',margin:0}}>乗り換えだけで月数千円節約できる</p>
            </div>
            <span style={{fontSize:'0.75rem',color:'#d97706',fontWeight:500,flexShrink:0}}>無料 →</span>
          </a>

          <p style={{fontSize:'0.625rem',color:'#d6d3d1',textAlign:'center',marginTop:'0.25rem'}}>※ 広告を含みます</p>
        </div>

      </div>
      </div>
    </div>
  )
}
