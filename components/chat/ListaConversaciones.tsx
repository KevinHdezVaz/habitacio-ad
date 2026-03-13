import Link from 'next/link'
import { Conversacion } from '@/types'

interface ConversacionConExtra extends Conversacion {
  ultimo_mensaje?: string
  nombre_otro?: string
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

        return (
          <Link
            key={conv.id}
            href={`/chat/${conv.id}`}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-[#f4f5f7] transition-colors ${activa ? 'bg-[#e8f4fd]' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-[#e8edf2] flex items-center justify-center flex-shrink-0">
              <span className="text-[#1a3c5e] font-bold text-sm">{nombreOtro[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1a3c5e] text-sm truncate">{nombreOtro}</p>
              {conv.anuncio?.titulo && (
                <p className="text-xs text-[#6b7280] truncate">{conv.anuncio.titulo}</p>
              )}
              {conv.ultimo_mensaje && (
                <p className="text-xs text-[#9ca3af] truncate mt-0.5">{conv.ultimo_mensaje}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
