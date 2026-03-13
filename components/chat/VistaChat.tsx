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
  const bottomRef = useRef<HTMLDivElement>(null)
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
      .then(() => router.refresh()) // actualiza el badge del navbar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversacionId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

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

    await supabase.from('mensajes').insert({
      conversacion_id: conversacionId,
      sender_id: currentUserId,
      contenido,
    })

    setEnviando(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
        {mensajes.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-[#9ca3af] text-sm">
            Empieza la conversación
          </div>
        )}
        {mensajes.map((msg) => {
          const esMio = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  esMio
                    ? 'bg-[#1a3c5e] text-white rounded-br-sm'
                    : 'bg-white text-[#1a3c5e] shadow-sm rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.contenido}</p>
                <p className={`text-[10px] mt-1 ${esMio ? 'text-blue-200' : 'text-[#9ca3af]'} text-right`}>
                  {new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white p-3 flex gap-2 items-end">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          rows={1}
          className="flex-1 resize-none border border-[#e5e7eb] rounded-2xl px-4 py-2.5 text-sm text-[#1a3c5e] focus:outline-none focus:ring-2 focus:ring-[#0ea5a0] max-h-32 overflow-y-auto"
        />
        <button
          onClick={enviar}
          disabled={!texto.trim() || enviando}
          className="bg-[#0ea5a0] text-white px-4 py-2.5 rounded-2xl text-sm font-semibold disabled:opacity-40 transition-opacity flex-shrink-0"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
