import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/layout/PageTransition'
import { createClient } from '@/lib/supabase-server'
import NextTopLoader from 'nextjs-toploader'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Habitacio.ad - Habitaciones en alquiler en Andorra',
  description: 'Encuentra habitación para todo el año o temporada en Andorra.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const locale   = await getLocale()
  const messages = await getMessages()

  let isAdmin     = false
  let unreadCount = 0
  let avatarUrl: string | null = null
  let userName:  string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tipo, avatar_url, nombre')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.tipo === 'admin'
    avatarUrl = profile?.avatar_url ?? null
    userName  = profile?.nombre ?? null

    // Mensajes no leídos
    const { data: convs } = await supabase
      .from('conversaciones')
      .select('id')
      .or(`inquilino_id.eq.${user.id},arrendador_id.eq.${user.id}`)

    if (convs && convs.length > 0) {
      const ids = convs.map((c) => c.id)
      const { count } = await supabase
        .from('mensajes')
        .select('id', { count: 'exact', head: true })
        .eq('leido', false)
        .neq('sender_id', user.id)
        .in('conversacion_id', ids)
      unreadCount = count ?? 0
    }
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextTopLoader
            color="#0ea5a0"
            height={3}
            showSpinner={false}
            shadow="0 0 10px #0ea5a0,0 0 5px #0ea5a0"
          />
          <Navbar user={user} isAdmin={isAdmin} unreadCount={unreadCount} locale={locale} avatarUrl={avatarUrl} userName={userName} />
          <main className="max-w-5xl mx-auto px-4 py-6">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
