import Link from 'next/link'
import { Conversacion } from '@/types'

interface ConversacionConExtra extends Conversacion {
  ultimo_mensaje?: string
  nombre_otro?: string
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
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
        <span className="text-4xl">💬</span>
        <p className="font-bold text-[#1a3c5e]">Sin conversaciones</p>
        <p className="text-sm text-[#6b7280]">Cuando contactes con un anunciante, aparecerá aquí.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {conversaciones.map((conv) => {
        const esArrendador = conv.arrendador_id === currentUserId
        const nombreOtro = conv.nombre_otro ?? (esArrendador ? 'Inquilino' : 'Anunciante')
        const activa = conv.id === conversacionActivaId
        const tieneNoLeidos = (conv.unread ?? 0) > 0

        return (
          <Link
            key={conv.id}
            href={`/chat/${conv.id}`}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-[#f4f5f7] transition-colors ${activa ? 'bg-[#e8f4fd]' : ''}`}
          >
            {/* Avatar con badge */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#e8edf2] flex items-center justify-center">
                <span className="text-[#1a3c5e] font-bold text-sm">{nombreOtro[0].toUpperCase()}</span>
              </div>
              {tieneNoLeidos && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {(conv.unread ?? 0) > 9 ? '9+' : conv.unread}
                </span>
              )}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${tieneNoLeidos ? 'font-bold text-[#1a3c5e]' : 'font-semibold text-[#1a3c5e]'}`}>
                {nombreOtro}
              </p>
              {conv.anuncio?.titulo && (
                <p className="text-xs text-[#6b7280] truncate">{conv.anuncio.titulo}</p>
              )}
              {conv.ultimo_mensaje && (
                <p className={`text-xs truncate mt-0.5 ${tieneNoLeidos ? 'text-[#1a3c5e] font-medium' : 'text-[#9ca3af]'}`}>
                  {conv.ultimo_mensaje}
                </p>
              )}
            </div>

            {/* Punto indicador a la derecha */}
            {tieneNoLeidos && (
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
