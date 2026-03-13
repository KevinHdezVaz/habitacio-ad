'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Mensaje } from '@/types'

interface Props {
  conversacionId: string
  currentUserId: string
  mensajesIniciales: Mensaje[]
}

export default function VistaChat({ conversacionId, currentUserId, mensajesIniciales }: Props) {
  const [mensajes, setMensajes] = useState<Mensaje[]>(mensajesIniciales)
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()
  const router = useRouter()

  // Marcar mensajes como leídos al abrir la conversación
  useEffect(() => {
    supabase
      .from('mensajes')
      .update({ leido: true })
      .eq('conversacion_id', conversacionId)
      .eq('leido', false)
      .neq('sender_id', currentUserId)
      .then(() => router.refresh())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversacionId])

  // Scroll al fondo del contenedor (no de la página)
  function scrollAlFondo(smooth = true) {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    })
  }

  // Scroll instantáneo al cargar, suave al recibir mensajes nuevos
  useEffect(() => {
    scrollAlFondo(mensajes !== mensajesIniciales)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensajes])

  // Realtime: nuevos mensajes
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${conversacionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes',
          filter: `conversacion_id=eq.${conversacionId}`,
        },
        (payload) => {
          const nuevo = payload.new as Mensaje
          setMensajes((prev) => {
            if (prev.some((m) => m.id === nuevo.id)) return prev
            return [...prev, nuevo]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversacionId])

  async function enviar() {
    const contenido = texto.trim()
    if (!contenido || enviando) return
    setEnviando(true)
    setTexto('')
    resetTextareaHeight()

    await supabase.from('mensajes').insert({
      conversacion_id: conversacionId,
      sender_id: currentUserId,
      contenido,
    })

    setEnviando(false)
  }

  function resetTextareaHeight() {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTexto(e.target.value)
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px'
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
    // Shift + Enter → salto de línea (comportamiento por defecto del textarea)
  }

  function formatHora(fecha: string) {
    return new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  // Agrupar mensajes consecutivos del mismo remitente
  function esMismoBloqueAnterior(index: number) {
    if (index === 0) return false
    return mensajes[index].sender_id === mensajes[index - 1].sender_id
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Mensajes */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto flex flex-col gap-1 px-4 py-4 bg-[#f4f7fa]"
      >
        {mensajes.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-[#9ca3af] text-base mt-16">
            Empieza la conversación 👋
          </div>
        )}

        {mensajes.map((msg, index) => {
          const esMio = msg.sender_id === currentUserId
          const agrupado = esMismoBloqueAnterior(index)

          return (
            <div
              key={msg.id}
              className={`flex ${esMio ? 'justify-end' : 'justify-start'} ${agrupado ? 'mt-0.5' : 'mt-3'}`}
            >
              <div className={`max-w-[78%] flex flex-col ${esMio ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-4 py-3 text-base leading-relaxed ${
                    esMio
                      ? `bg-[#1a3c5e] text-white ${agrupado ? 'rounded-2xl rounded-tr-md' : 'rounded-2xl rounded-br-md'}`
                      : `bg-white text-[#1a3c5e] shadow-sm ${agrupado ? 'rounded-2xl rounded-tl-md' : 'rounded-2xl rounded-bl-md'}`
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.contenido}</p>
                </div>
                {/* Hora: sólo en el último de cada bloque o si es el último mensaje */}
                {(!mensajes[index + 1] || mensajes[index + 1].sender_id !== msg.sender_id) && (
                  <span className={`text-[11px] mt-1 px-1 ${esMio ? 'text-[#9ca3af]' : 'text-[#9ca3af]'}`}>
                    {formatHora(msg.created_at)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white px-3 py-3 flex gap-2 items-end flex-shrink-0">
        <textarea
          ref={textareaRef}
          value={texto}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje… (Intro para enviar)"
          rows={1}
          className="flex-1 resize-none border border-[#e5e7eb] rounded-2xl px-4 py-3 text-base text-[#1a3c5e] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0ea5a0] overflow-y-auto leading-relaxed"
          style={{ maxHeight: '128px' }}
        />
        <button
          onClick={enviar}
          disabled={!texto.trim() || enviando}
          className="bg-[#0ea5a0] text-white px-5 py-3 rounded-2xl text-base font-semibold disabled:opacity-40 transition-opacity flex-shrink-0 hover:bg-[#0d9490] active:scale-95"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
