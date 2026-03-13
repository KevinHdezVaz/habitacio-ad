import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase-server'

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

  return (
    <html lang="es">
      <body>
        <Navbar user={user} />
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}