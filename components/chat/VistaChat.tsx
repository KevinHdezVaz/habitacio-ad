'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Mensaje } from '@/types'
import { enviarMensaje } from '@/app/actions/chat'
import { useTranslations } from 'next-intl'

interface Props {
  conversacionId: string
  currentUserId: string
  mensajesIniciales: Mensaje[]
}

function formatHora(fecha: string) {
  return new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function formatFecha(fecha: string, today: string, yesterday: string) {
  const d = new Date(fecha)
  const hoy = new Date()
  const ayer = new Date(hoy)
  ayer.setDate(hoy.getDate() - 1)

  if (d.toDateString() === hoy.toDateString()) return today
  if (d.toDateString() === ayer.toDateString()) return yesterday
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function esMismoDia(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

export default function VistaChat({ conversacionId, currentUserId, mensajesIniciales }: Props) {
  const t = useTranslations('chat')
  const [mensajes, setMensajes] = useState<Mensaje[]>(mensajesIniciales)
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()
  const router = useRouter()

  // ─── Scroll helpers ───────────────────────────────────────────────────────
  function esCercaDelFondo() {
    const container = messagesContainerRef.current
    if (!container) return true
    return container.scrollHeight - container.scrollTop - container.clientHeight < 120
  }

  function scrollAlFondo(behavior: ScrollBehavior = 'smooth') {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' })
  }

  // Scroll instantáneo al montar
  useEffect(() => {
    scrollAlFondo('instant')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Marcar como leídos (sin router.refresh para evitar scroll de página) ─
  useEffect(() => {
    supabase
      .from('mensajes')
      .update({ leido: true })
      .eq('conversacion_id', conversacionId)
      .eq('leido', false)
      .neq('sender_id', currentUserId)
      .then(() => {
        // Refrescamos silenciosamente solo el badge de mensajes no leídos
        router.refresh()
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversacionId])

  // ─── Realtime: nuevos mensajes ────────────────────────────────────────────
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

          // Solo hacer scroll automático si el usuario ya estaba cerca del fondo
          // o si el mensaje es del propio usuario
          if (nuevo.sender_id === currentUserId || esCercaDelFondo()) {
            requestAnimationFrame(() => scrollAlFondo('smooth'))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversacionId])

  // ─── Enviar ───────────────────────────────────────────────────────────────
  async function enviar() {
    const contenido = texto.trim()
    if (!contenido || enviando) return
    setEnviando(true)
    setTexto('')
    resetTextareaHeight()

    // Usamos server action para poder disparar notificación por email
    await enviarMensaje(conversacionId, contenido)

    setEnviando(false)
    // Scroll al fondo tras enviar propio mensaje
    requestAnimationFrame(() => scrollAlFondo('smooth'))
  }

  function resetTextareaHeight() {
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTexto(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px'
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
    // Shift + Enter → salto de línea (comportamiento por defecto)
  }

  // ─── Helpers de agrupación ────────────────────────────────────────────────
  function esMismoBloqueAnterior(index: number) {
    if (index === 0) return false
    return mensajes[index].sender_id === mensajes[index - 1].sender_id
  }

  function esMismoBloquesiguiente(index: number) {
    if (index === mensajes.length - 1) return false
    return mensajes[index].sender_id === mensajes[index + 1].sender_id
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* ── Lista de mensajes ────────────────────────────────────────────── */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-0.5"
        style={{ background: 'linear-gradient(180deg, #f4f7fa 0%, #eef2f7 100%)' }}
      >
        {mensajes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 pt-20 pb-10">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl">
              💬
            </div>
            <p className="text-[#6b7280] text-base font-medium">{t('emptyState')}</p>
            <p className="text-[#9ca3af] text-sm">{t('sayHello')} 👋</p>
          </div>
        )}

        {mensajes.map((msg, index) => {
          const esMio = msg.sender_id === currentUserId
          const agrupadoArriba = esMismoBloqueAnterior(index)
          const agrupadoAbajo = esMismoBloquesiguiente(index)
          const mostrarFecha = index === 0 || !esMismoDia(msg.created_at, mensajes[index - 1].created_at)
          const mostrarHora = !agrupadoAbajo

          // Radio de las esquinas según agrupación y lado
          let bubbleRadius: string
          if (esMio) {
            if (!agrupadoArriba && !agrupadoAbajo) bubbleRadius = 'rounded-2xl rounded-br-sm'
            else if (!agrupadoArriba) bubbleRadius = 'rounded-2xl rounded-br-sm rounded-b-none'
            else if (!agrupadoAbajo) bubbleRadius = 'rounded-2xl rounded-tr-sm'
            else bubbleRadius = 'rounded-2xl rounded-r-sm'
          } else {
            if (!agrupadoArriba && !agrupadoAbajo) bubbleRadius = 'rounded-2xl rounded-bl-sm'
            else if (!agrupadoArriba) bubbleRadius = 'rounded-2xl rounded-bl-sm rounded-b-none'
            else if (!agrupadoAbajo) bubbleRadius = 'rounded-2xl rounded-tl-sm'
            else bubbleRadius = 'rounded-2xl rounded-l-sm'
          }

          return (
            <div key={msg.id}>
              {/* Separador de fecha */}
              {mostrarFecha && (
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#e5eaf0]" />
                  <span className="text-[11px] font-semibold text-[#9ca3af] tracking-wide uppercase px-2">
                    {formatFecha(msg.created_at, t('today'), t('yesterday'))}
                  </span>
                  <div className="flex-1 h-px bg-[#e5eaf0]" />
                </div>
              )}

              {/* Burbuja */}
              <div className={`flex ${esMio ? 'justify-end' : 'justify-start'} ${agrupadoArriba ? 'mt-0.5' : 'mt-3'}`}>
                <div className={`max-w-[78%] sm:max-w-[68%] flex flex-col ${esMio ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2.5 text-[15px] leading-relaxed break-words ${bubbleRadius} ${
                      esMio
                        ? 'bg-[#1a3c5e] text-white'
                        : 'bg-white text-[#1a3c5e] shadow-sm border border-[#eef2f7]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.contenido}</p>
                  </div>

                  {/* Hora debajo del último mensaje del bloque */}
                  {mostrarHora && (
                    <span className="text-[11px] mt-1 px-1 text-[#aab4c0] select-none">
                      {formatHora(msg.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Ancla para scroll */}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* ── Input de texto ───────────────────────────────────────────────── */}
      <div className="border-t border-[#e8edf2] bg-white px-3 py-3 flex gap-2 items-end flex-shrink-0 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <textarea
          ref={textareaRef}
          value={texto}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t('inputPlaceholder')}
          rows={1}
          className="flex-1 resize-none border border-[#e5e7eb] rounded-2xl px-4 py-3 text-[15px] text-[#1a3c5e] placeholder-[#b0b9c4] focus:outline-none focus:ring-2 focus:ring-[#0ea5a0] focus:border-transparent overflow-y-auto leading-relaxed bg-[#f9fafc] transition-colors"
          style={{ maxHeight: '140px' }}
        />
        <button
          onClick={enviar}
          disabled={!texto.trim() || enviando}
          aria-label={t('sendMessage')}
          className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            texto.trim() && !enviando
              ? 'bg-gradient-to-br from-[#0ea5a0] to-[#0d8f8a] text-white shadow-md hover:shadow-lg active:scale-95'
              : 'bg-[#f0f4f8] text-[#b0b9c4] cursor-not-allowed'
          }`}
        >
          {enviando ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Hint debajo del input */}
      <div className="bg-white px-4 pb-2 flex-shrink-0">
        <p className="text-[10px] text-[#c0c8d2] text-center">
          {t('sendHint')}
        </p>
      </div>
    </div>
  )
}
