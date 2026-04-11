import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/layout/BottomNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <div style={{minHeight:'100vh',background:'#fafaf9'}}>
      <main style={{paddingBottom:'5rem',maxWidth:'448px',margin:'0 auto'}}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
