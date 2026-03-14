import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { Conversacion } from '@/types'

interface ConversacionConExtra extends Conversacion {
  ultimo_mensaje?: string
  nombre_otro?: string
  avatar_otro?: string
  unread?: number
}

interface Props {
  conversaciones: ConversacionConExtra[]
  currentUserId: string
  conversacionActivaId?: string
}

export default function ListaConversaciones({ conversaciones, currentUserId, conversacionActivaId }: Props) {
  if (conversaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center px-6 py-16">
        <div className="w-16 h-16 rounded-full bg-[#f4f7fa] flex items-center justify-center text-3xl">
          💬
        </div>
        <div>
          <p className="font-bold text-[#1a3c5e] text-base">Sin conversaciones aún</p>
          <p className="text-sm text-[#6b7280] mt-1">
            Cuando contactes con un anunciante o recibas un mensaje, aparecerá aquí.
          </p>
        </div>
        <Link
          href="/habitaciones"
          className="mt-2 inline-flex items-center gap-2 bg-[#1a3c5e] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#14304f] transition-colors"
        >
          Buscar habitaciones
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-[#f0f4f8]">
      {conversaciones.map((conv) => {
        const esArrendador = conv.arrendador_id === currentUserId
        const nombreOtro = conv.nombre_otro ?? (esArrendador ? 'Inquilino' : 'Anunciante')
        const activa = conv.id === conversacionActivaId
        const tieneNoLeidos = (conv.unread ?? 0) > 0

        return (
          <Link
            key={conv.id}
            href={`/chat/${conv.id}`}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-[#f9fafc] transition-colors group ${
              activa ? 'bg-[#eef6ff]' : ''
            }`}
          >
            {/* Avatar con badge de no leídos */}
            <div className="relative flex-shrink-0">
              <Avatar
                nombre={nombreOtro}
                avatarUrl={conv.avatar_otro ?? null}
                size="md"
              />
              {tieneNoLeidos && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
                  {(conv.unread ?? 0) > 9 ? '9+' : conv.unread}
                </span>
              )}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-[15px] truncate ${tieneNoLeidos ? 'font-bold text-[#1a3c5e]' : 'font-semibold text-[#374151]'}`}>
                  {nombreOtro}
                </p>
                {/* Punto verde / badge derecha */}
                {tieneNoLeidos && (
                  <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-red-500" />
                )}
              </div>

              {conv.anuncio?.titulo && (
                <p className="text-xs text-[#0ea5a0] truncate font-medium mt-0.5">
                  📍 {conv.anuncio.titulo}
                </p>
              )}

              {conv.ultimo_mensaje && (
                <p className={`text-sm truncate mt-0.5 ${
                  tieneNoLeidos ? 'text-[#1a3c5e] font-medium' : 'text-[#9ca3af]'
                }`}>
                  {conv.ultimo_mensaje}
                </p>
              )}
            </div>

            {/* Flecha en hover */}
            <svg
              className="w-4 h-4 text-[#c0c8d2] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )
      })}
    </div>
  )
}
