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
    <div className="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Cabecera */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 flex-shrink-0">
        <Link href="/chat" className="text-[#1a3c5e] hover:text-[#0ea5a0] transition-colors p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="w-10 h-10 rounded-full bg-[#e8edf2] flex items-center justify-center flex-shrink-0">
          <span className="text-[#1a3c5e] font-bold text-base">
            {(otroPerfil?.nombre ?? 'A')[0].toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1a3c5e] text-base">{otroPerfil?.nombre ?? 'Anónimo'}</p>
          {conv.anuncio?.titulo && (
            <Link
              href={`/habitaciones/${conv.anuncio.id}`}
              className="text-xs text-[#0ea5a0] hover:underline truncate block"
            >
              {conv.anuncio.titulo}
            </Link>
          )}
        </div>
      </div>

      {/* Vista del chat */}
      <VistaChat
        conversacionId={id}
        currentUserId={user.id}
        mensajesIniciales={(mensajes ?? []) as Mensaje[]}
      />
    </div>
  )
}
