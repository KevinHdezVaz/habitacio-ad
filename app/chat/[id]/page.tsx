import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import VistaChat from '@/components/chat/VistaChat'
import { Mensaje } from '@/types'

export default async function ChatDetallesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/chat/${id}`)

  const { data: conv } = await supabase
    .from('conversaciones')
    .select('*, anuncio:anuncios(id, titulo, parroquia)')
    .eq('id', id)
    .single()

  if (!conv) notFound()

  // Verificar que el usuario es parte de esta conversación
  if (conv.inquilino_id !== user.id && conv.arrendador_id !== user.id) {
    redirect('/chat')
  }

  const otroId = conv.arrendador_id === user.id ? conv.inquilino_id : conv.arrendador_id
  const { data: otroPerfil } = await supabase
    .from('profiles')
    .select('nombre')
    .eq('id', otroId)
    .single()

  const { data: mensajes } = await supabase
    .from('mensajes')
    .select('*')
    .eq('conversacion_id', id)
    .order('created_at', { ascending: true })

  return (
    /*
      Usamos dvh para tener en cuenta la barra del navegador móvil.
      El contenedor ocupa toda la pantalla disponible sin dejar que la página haga scroll.
    */
    <div
      className="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden"
      style={{ height: 'calc(100dvh - 112px)' }}
    >
      {/* ── Cabecera ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e8edf2] flex-shrink-0 bg-white">
        <Link
          href="/chat"
          className="text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors p-1.5 rounded-xl hover:bg-[#f4f7fa] -ml-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Avatar del otro usuario */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a3c5e] to-[#2d5a8e] flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-base">
            {(otroPerfil?.nombre ?? 'A')[0].toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1a3c5e] text-[15px] leading-tight">{otroPerfil?.nombre ?? 'Anónimo'}</p>
          {conv.anuncio?.titulo && (
            <Link
              href={`/habitaciones/${conv.anuncio.id}`}
              className="text-xs text-[#0ea5a0] hover:underline truncate block mt-0.5"
            >
              📍 {conv.anuncio.titulo}
            </Link>
          )}
        </div>

        {/* Botón ver anuncio (desktop) */}
        {conv.anuncio?.id && (
          <Link
            href={`/habitaciones/${conv.anuncio.id}`}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#0ea5a0] border border-[#0ea5a0]/30 rounded-xl px-3 py-1.5 hover:bg-[#0ea5a0]/5 transition-colors flex-shrink-0"
          >
            Ver anuncio
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* ── Vista del chat ────────────────────────────────────────────────── */}
      <VistaChat
        conversacionId={id}
        currentUserId={user.id}
        mensajesIniciales={(mensajes ?? []) as Mensaje[]}
      />
    </div>
  )
}
