import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('ai_calls_this_month,ai_calls_reset_at').eq('id', user.id).single()

  const today = new Date().toISOString().split('T')[0]
  const resetAt = profile?.ai_calls_reset_at ?? today
  const calls = resetAt < today.slice(0,7)+'-01' ? 0 : (profile?.ai_calls_this_month ?? 0)

  if (calls >= 30) {
    return NextResponse.json({ error: '月30回の上限に達しました。' }, { status: 429 })
  }

  const { income, expense, habitDone, habitTotal } = await req.json()
  const prompt = `家計：収入¥${income}、支出¥${expense}、収支¥${income-expense}。習慣：${habitDone}/${habitTotal}達成。日本語で100字以内のやさしい一言アドバイスを返せ。`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await res.json()
  const advice = data.content?.[0]?.text ?? 'よく頑張っています！この調子で続けましょう。'

  await supabase.from('profiles').update({
    ai_calls_this_month: calls + 1,
    ai_calls_reset_at: today
  }).eq('id', user.id)

  return NextResponse.json({ advice, remaining: 30 - calls - 1 })
}
