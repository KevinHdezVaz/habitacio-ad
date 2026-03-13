import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/layout/PageTransition'
import { createClient } from '@/lib/supabase-server'
import NextTopLoader from 'nextjs-toploader'

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

  let isAdmin    = false
  let unreadCount = 0

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tipo')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.tipo === 'admin'

    // Mensajes no leídos (enviados por otro en conversaciones del usuario)
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
    <html lang="es">
      <body>
        <NextTopLoader
          color="#0ea5a0"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #0ea5a0,0 0 5px #0ea5a0"
        />
        <Navbar user={user} isAdmin={isAdmin} unreadCount={unreadCount} />
        <main className="max-w-5xl mx-auto px-4 py-6">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  )
}
