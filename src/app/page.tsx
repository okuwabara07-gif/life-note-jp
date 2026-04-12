import Link from 'next/link'
import Image from 'next/image'

export default function TopPage() {
  return (
    <div style={{minHeight:'100vh',background:'#fafaf9'}}>
      <div style={{maxWidth:'448px',margin:'0 auto'}}>

        {/* 案B: フルブリード写真 + 半透明UIカード */}
        <div style={{position:'relative',width:'100%',height:'380px',overflow:'hidden'}}>
          <Image
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80"
            alt="穏やかな朝の日常"
            fill
            style={{objectFit:'cover',objectPosition:'center 30%'}}
            priority
          />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(28,25,23,0.8) 100%)'}} />

          {/* ロゴ */}
          <div style={{position:'absolute',top:'1.25rem',left:'1.25rem'}}>
            <p style={{fontSize:'1.375rem',fontWeight:700,color:'#fff',margin:0,letterSpacing:'-0.03em'}}>📒 LifeNote</p>
          </div>

          {/* 半透明サマリーカード */}
          <div style={{
            position:'absolute',top:'1.25rem',right:'1.25rem',
            background:'rgba(255,255,255,0.12)',
            border:'1px solid rgba(255,255,255,0.22)',
            borderRadius:'14px',padding:'10px 12px',width:'130px',
            backdropFilter:'blur(8px)',
          }}>
            <p style={{fontSize:'9px',color:'rgba(255,255,255,0.6)',margin:'0 0 5px',fontWeight:500}}>今日のサマリー</p>
            <div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'4px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#4ade80',flexShrink:0}}></div>
              <span style={{fontSize:'10px',color:'#fff'}}>残高 ¥28,400</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'5px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#fbbf24',flexShrink:0}}></div>
              <span style={{fontSize:'10px',color:'#fff'}}>習慣 4/5</span>
            </div>
            <div style={{height:'3px',background:'rgba(255,255,255,0.2)',borderRadius:'2px',overflow:'hidden'}}>
              <div style={{height:'100%',width:'80%',background:'#4ade80',borderRadius:'2px'}}></div>
            </div>
          </div>

          {/* キャッチコピー */}
          <div style={{position:'absolute',bottom:'1.5rem',left:'1.25rem',right:'1.25rem'}}>
            <h1 style={{fontSize:'1.625rem',fontWeight:700,color:'#fff',lineHeight:1.25,margin:'0 0 0.5rem',letterSpacing:'-0.03em'}}>
              お金と習慣を、<br />やさしく続ける
            </h1>
            <p style={{fontSize:'0.875rem',color:'rgba(255,255,255,0.7)',margin:0,lineHeight:1.5}}>
              毎日ちょっとの記録が、人生を変える
            </p>
          </div>
        </div>

        {/* 案D: 横スクロール機能カード */}
        <div style={{background:'#fff',paddingTop:'1.25rem'}}>
          <p style={{fontSize:'0.75rem',fontWeight:500,color:'#a8a29e',padding:'0 1.25rem',margin:'0 0 0.75rem',letterSpacing:'0.05em'}}>できること</p>
          <div style={{display:'flex',gap:'10px',padding:'0 1.25rem 1.25rem',overflowX:'auto',scrollSnapType:'x mandatory'}}>

            {/* カード1: 習慣 */}
            <div style={{flexShrink:0,width:'160px',borderRadius:'14px',overflow:'hidden',background:'#1c1917',scrollSnapAlign:'start'}}>
              <div style={{position:'relative',height:'100px',overflow:'hidden'}}>
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80"
                  alt="習慣トラッカー"
                  fill
                  style={{objectFit:'cover',opacity:0.65}}
                />
              </div>
              <div style={{padding:'10px 11px 12px'}}>
                <p style={{fontSize:'10px',color:'rgba(255,255,255,0.5)',margin:'0 0 2px'}}>習慣トラッカー</p>
                <p style={{fontSize:'12px',fontWeight:600,color:'#fff',margin:'0 0 5px'}}>続けることが<br />楽しくなる</p>
                <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#4ade80',border:'1.5px solid #4ade80'}}></div>
                  <span style={{fontSize:'9px',color:'rgba(255,255,255,0.6)'}}>ストリーク記録</span>
                </div>
              </div>
            </div>

            {/* カード2: 家計簿 */}
            <div style={{flexShrink:0,width:'160px',borderRadius:'14px',overflow:'hidden',background:'#1c1917',scrollSnapAlign:'start'}}>
              <div style={{position:'relative',height:'100px',overflow:'hidden'}}>
                <Image
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80"
                  alt="AI家計簿"
                  fill
                  style={{objectFit:'cover',opacity:0.65}}
                />
              </div>
              <div style={{padding:'10px 11px 12px'}}>
                <p style={{fontSize:'10px',color:'rgba(255,255,255,0.5)',margin:'0 0 2px'}}>AI家計簿</p>
                <p style={{fontSize:'12px',fontWeight:600,color:'#fff',margin:'0 0 5px'}}>お金の流れが<br />一目でわかる</p>
                <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#fbbf24',border:'1.5px solid #fbbf24'}}></div>
                  <span style={{fontSize:'9px',color:'rgba(255,255,255,0.6)'}}>月次AI分析</span>
                </div>
              </div>
            </div>

            {/* カード3: メモ */}
            <div style={{flexShrink:0,width:'160px',borderRadius:'14px',overflow:'hidden',background:'#1c1917',scrollSnapAlign:'start'}}>
              <div style={{position:'relative',height:'100px',overflow:'hidden'}}>
                <Image
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80"
                  alt="毎日のメモ"
                  fill
                  style={{objectFit:'cover',opacity:0.65}}
                />
              </div>
              <div style={{padding:'10px 11px 12px'}}>
                <p style={{fontSize:'10px',color:'rgba(255,255,255,0.5)',margin:'0 0 2px'}}>AIアドバイス</p>
                <p style={{fontSize:'12px',fontWeight:600,color:'#fff',margin:'0 0 5px'}}>あなただけの<br />やさしい一言</p>
                <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#a78bfa',border:'1.5px solid #a78bfa'}}></div>
                  <span style={{fontSize:'9px',color:'rgba(255,255,255,0.6)'}}>月30回まで無料</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 未来タイムライン（小さく） */}
        <div style={{background:'#fafaf9',padding:'1rem 1.25rem',borderTop:'1px solid #f0ede8'}}>
          <p style={{fontSize:'0.75rem',fontWeight:500,color:'#a8a29e',margin:'0 0 0.75rem',letterSpacing:'0.05em'}}>続けると、こうなる</p>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {[
              {period:'1ヶ月後', text:'朝のルーティンが完成。体重−1.5kg', color:'#4ade80'},
              {period:'3ヶ月後', text:'家計の無駄が消えて月2万円の余裕', color:'#fbbf24'},
              {period:'1年後',   text:'健康診断の数値が別人。貯金36,500円', color:'#a78bfa'},
            ].map(item => (
              <div key={item.period} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',background:'#fff',borderRadius:'10px',border:'1px solid #f0ede8'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:item.color,flexShrink:0}}></div>
                <span style={{fontSize:'10px',fontWeight:500,color:'#78716c',flexShrink:0,width:'48px'}}>{item.period}</span>
                <span style={{fontSize:'11px',color:'#44403c'}}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{padding:'1.25rem',background:'#fff',borderTop:'1px solid #f0ede8'}}>
          <Link
            href="/register"
            style={{
              display:'block',width:'100%',boxSizing:'border-box',
              padding:'1rem',borderRadius:'0.75rem',
              background:'#1c1917',color:'#fff',
              fontSize:'1rem',fontWeight:600,textAlign:'center',textDecoration:'none',
              letterSpacing:'-0.01em',
            }}
          >
            無料で始める →
          </Link>
          <Link
            href="/login"
            style={{
              display:'block',marginTop:'0.625rem',
              padding:'0.75rem',borderRadius:'0.75rem',
              border:'1px solid #e7e5e4',color:'#78716c',
              fontSize:'0.875rem',fontWeight:500,textAlign:'center',textDecoration:'none',
            }}
          >
            ログイン
          </Link>
          <p style={{textAlign:'center',fontSize:'0.75rem',color:'#d6d3d1',marginTop:'0.875rem',marginBottom:0}}>
            クレジットカード不要 · いつでも解約可能
          </p>
        </div>

      </div>
    </div>
  )
}

        {/* ヒーロー画像 */}
        <div style={{position:'relative',width:'100%',height:'320px',overflow:'hidden'}}>
          <Image
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80"
            alt="朝の散歩 - 穏やかな日常"
            fill
            style={{objectFit:'cover',objectPosition:'center'}}
            priority
          />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(28,25,23,0.75) 100%)'}} />
          <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1.5rem'}}>
            <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>📒</div>
            <h1 style={{fontSize:'1.625rem',fontWeight:700,color:'#fff',lineHeight:1.3,margin:'0 0 0.5rem',letterSpacing:'-0.02em'}}>
              お金と習慣を、<br />やさしく続ける
            </h1>
            <p style={{color:'rgba(255,255,255,0.75)',fontSize:'0.875rem',lineHeight:1.6,margin:0}}>
              毎日ちょっとの記録が、人生を変える。
            </p>
          </div>
        </div>

        <div style={{padding:'1.5rem 1.25rem 5rem'}}>

          {/* 機能カード - 画像付き */}
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginBottom:'2rem'}}>

            {/* 家計簿カード */}
            <div style={{borderRadius:'1rem',border:'1px solid #f0ede8',overflow:'hidden',background:'#fff'}}>
              <div style={{position:'relative',width:'100%',height:'140px'}}>
                <Image
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80"
                  alt="家計簿・お金の管理"
                  fill
                  style={{objectFit:'cover',objectPosition:'center'}}
                />
                <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.25)'}} />
                <div style={{position:'absolute',bottom:'0.75rem',left:'0.875rem'}}>
                  <span style={{fontSize:'1.5rem'}}>💰</span>
                </div>
              </div>
              <div style={{padding:'0.875rem 1rem'}}>
                <p style={{fontSize:'0.9375rem',fontWeight:600,color:'#1c1917',margin:'0 0 3px'}}>AI家計簿</p>
                <p style={{fontSize:'0.8125rem',color:'#78716c',margin:0,lineHeight:1.5}}>支出を記録して、AIが毎月の傾向を分析。お金の流れが一目でわかる。</p>
              </div>
            </div>

            {/* 習慣カード */}
            <div style={{borderRadius:'1rem',border:'1px solid #f0ede8',overflow:'hidden',background:'#fff'}}>
              <div style={{position:'relative',width:'100%',height:'140px'}}>
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80"
                  alt="習慣トラッカー・毎日の記録"
                  fill
                  style={{objectFit:'cover',objectPosition:'center'}}
                />
                <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.25)'}} />
                <div style={{position:'absolute',bottom:'0.75rem',left:'0.875rem'}}>
                  <span style={{fontSize:'1.5rem'}}>✅</span>
                </div>
              </div>
              <div style={{padding:'0.875rem 1rem'}}>
                <p style={{fontSize:'0.9375rem',fontWeight:600,color:'#1c1917',margin:'0 0 3px'}}>習慣トラッカー</p>
                <p style={{fontSize:'0.8125rem',color:'#78716c',margin:0,lineHeight:1.5}}>ストリークで継続を可視化。続けることが楽しくなる仕組み。</p>
              </div>
            </div>

            {/* AIアドバイスカード */}
            <div style={{borderRadius:'1rem',border:'1px solid #f0ede8',overflow:'hidden',background:'#fff'}}>
              <div style={{position:'relative',width:'100%',height:'140px'}}>
                <Image
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&q=80"
                  alt="ノート・メモ・日記"
                  fill
                  style={{objectFit:'cover',objectPosition:'center'}}
                />
                <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.25)'}} />
                <div style={{position:'absolute',bottom:'0.75rem',left:'0.875rem'}}>
                  <span style={{fontSize:'1.5rem'}}>🤖</span>
                </div>
              </div>
              <div style={{padding:'0.875rem 1rem'}}>
                <p style={{fontSize:'0.9375rem',fontWeight:600,color:'#1c1917',margin:'0 0 3px'}}>AIアドバイス</p>
                <p style={{fontSize:'0.8125rem',color:'#78716c',margin:0,lineHeight:1.5}}>月30回、あなたのデータを見てやさしく一言。次の一手が見えてくる。</p>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
            <Link href="/register" className="btn-primary" style={{fontSize:'1rem',padding:'1rem',textAlign:'center',textDecoration:'none',display:'block',borderRadius:'0.75rem',background:'#1c1917',color:'#fff',fontWeight:600}}>
              無料で始める →
            </Link>
            <Link href="/login" className="btn-secondary" style={{fontSize:'0.875rem',padding:'0.75rem',textAlign:'center',textDecoration:'none',display:'block',borderRadius:'0.75rem',border:'1px solid #e7e5e4',color:'#44403c',fontWeight:500}}>
              ログイン
            </Link>
          </div>
          <p style={{textAlign:'center',fontSize:'0.75rem',color:'#d6d3d1',marginTop:'1.25rem'}}>クレジットカード不要 · いつでも解約可能</p>

        </div>
      </div>
    </div>
  )
}
