import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tipo, nombre')
    .eq('id', user.id)
    .single()

  if (profile?.tipo !== 'admin') redirect('/')

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/anuncios', label: 'Anuncios', icon: '🏠' },
    { href: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* Header admin */}
      <header className="bg-[#1a3c5e] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight">habitacio.ad</span>
          <span className="bg-[#0ea5a0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-200 hidden sm:block">{profile.nombre}</span>
          <Link href="/" className="text-xs text-blue-300 hover:text-white transition-colors">
            ← Volver al sitio
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 bg-white border-r border-gray-100 min-h-[calc(100vh-49px)] hidden md:block">
          <nav className="p-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f4f5f7] hover:text-[#1a3c5e] transition-colors"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full border-b border-gray-100 bg-white">
          <nav className="flex gap-1 p-2 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[#374151] hover:bg-[#f4f5f7] whitespace-nowrap"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
