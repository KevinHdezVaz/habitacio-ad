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
  title: {
    default: 'Habitacio.ad — Habitaciones en alquiler en Andorra',
    template: '%s | Habitacio.ad',
  },
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  description: 'Encuentra habitación en alquiler en Andorra. Pisos para todo el año o temporada de esquí. La plataforma de habitaciones más completa del Principat.',
  metadataBase: new URL('https://habitacio.ad'),
  keywords: ['habitaciones andorra', 'alquiler andorra', 'piso andorra', 'habitació andorra', 'temporeros andorra', 'esqui andorra alquiler'],
  authors: [{ name: 'Habitacio.ad' }],
  creator: 'Habitacio.ad',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://habitacio.ad',
    siteName: 'Habitacio.ad',
    title: 'Habitacio.ad — Habitaciones en alquiler en Andorra',
    description: 'Encuentra habitación en alquiler en Andorra. Pisos para todo el año o temporada de esquí.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Habitacio.ad — Habitaciones en Andorra',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habitacio.ad — Habitaciones en alquiler en Andorra',
    description: 'Encuentra habitación en alquiler en Andorra. Pisos para todo el año o temporada de esquí.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
