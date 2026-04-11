import Link from 'next/link'

export default function TopPage() {
  return (
    <div style={{minHeight:'100vh',background:'#fafaf9'}}>
      <div style={{maxWidth:'448px',margin:'0 auto',padding:'4rem 1.5rem 5rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📒</div>
          <h1 style={{fontSize:'1.875rem',fontWeight:700,color:'#1c1917',marginBottom:'0.75rem',lineHeight:1.3}}>
            お金と習慣を、<br />やさしく続ける
          </h1>
          <p style={{color:'#78716c',fontSize:'1rem',lineHeight:1.6}}>
            AI家計簿と習慣トラッカーが合体。<br />
            毎日ちょっとの記録が、人生を変える。
          </p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginBottom:'2.5rem'}}>
          {[
            {icon:'💰',title:'AI家計簿',desc:'レシートを記録して、AIが毎月の傾向を分析'},
            {icon:'✅',title:'習慣トラッカー',desc:'ストリークで継続を可視化、やる気が続く'},
            {icon:'🤖',title:'AIアドバイス',desc:'月30回、あなたに合ったやさしい一言'},
          ].map(f => (
            <div key={f.title} style={{display:'flex',alignItems:'flex-start',gap:'1rem',background:'#fff',borderRadius:'1rem',border:'1px solid #f5f5f4',padding:'1rem'}}>
              <span style={{fontSize:'1.5rem',flexShrink:0}}>{f.icon}</span>
              <div>
                <p style={{fontSize:'0.875rem',fontWeight:600,color:'#1c1917'}}>{f.title}</p>
                <p style={{fontSize:'0.75rem',color:'#a8a29e',marginTop:'0.125rem'}}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          <Link href="/register" className="btn-primary" style={{fontSize:'1rem',padding:'1rem'}}>無料で始める →</Link>
          <Link href="/login" className="btn-secondary" style={{fontSize:'0.875rem',padding:'0.75rem'}}>ログイン</Link>
        </div>
        <p style={{textAlign:'center',fontSize:'0.75rem',color:'#d6d3d1',marginTop:'1.5rem'}}>クレジットカード不要 · いつでも解約可能</p>
      </div>
    </div>
  )
}
