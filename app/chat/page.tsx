import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ListaConversaciones from '@/components/chat/ListaConversaciones'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/chat')

  const { data: conversaciones } = await supabase
    .from('conversaciones')
    .select('*, anuncio:anuncios(titulo)')
    .or(`inquilino_id.eq.${user.id},arrendador_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  // Enriquecer con nombre del otro participante + mensajes no eídos
  const convIds = (conversaciones ?? []).map((c) => c.id)

  // Unread count por conversación
  const { data: mensajesNoLeidos } = await supabase
    .from('mensajes')
    .select('conversacion_id')
    .eq('leido', false)
    .neq('sender_id', user.id)
    .in('conversacion_id', convIds.length > 0 ? convIds : [''])

  const unreadPerConv: Record<string, number> = {}
  for (const m of mensajesNoLeidos ?? []) {
    unreadPerConv[m.conversacion_id] = (unreadPerConv[m.conversacion_id] ?? 0) + 1
  }

  const convConNombres = await Promise.all(
    (conversaciones ?? []).map(async (conv) => {
      const otroId = conv.arrendador_id === user.id ? conv.inquilino_id : conv.arrendador_id
      const { data: perfil } = await supabase
        .from('profiles')
        .select('nombre')
        .eq('id', otroId)
        .single()

      const { data: ultimo } = await supabase
        .from('mensajes')
        .select('contenido')
        .eq('conversacion_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        ...conv,
        nombre_otro: perfil?.nombre ?? undefined,
        ultimo_mensaje: ultimo?.contenido ?? undefined,
        unread: unreadPerConv[conv.id] ?? 0,
      }
    })
  )

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Mensajes</h1>
        <p className="text-[#6b7280] text-sm">{convConNombres.length} conversaciones</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <ListaConversaciones
          conversaciones={convConNombres}
          currentUserId={user.id}
        />
      </div>
    </div>
  )
}
