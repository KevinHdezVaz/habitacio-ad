'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function NuevaContrasenaPage() {
  const router = useRouter()
  const [password,   setPassword]   = useState('')
  const [confirmar,  setConfirmar]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [listo,      setListo]      = useState(false)
  const [sesionOk,   setSesionOk]   = useState(false)

  // Verificar que hay sesión activa (el callback ya la estableció)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesionOk(!!session)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })

    setLoading(false)
    if (err) {
      setError('No se pudo actualizar la contraseña. El enlace puede haber expirado.')
    } else {
      setListo(true)
      setTimeout(() => router.push('/'), 2500)
    }
  }

  if (listo) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#e6f7f7] to-[#f0fafa] flex items-center justify-center text-4xl shadow-sm">
            ✅
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a3c5e]">¡Contraseña actualizada!</h1>
            <p className="text-[#6b7280] text-sm mt-2">
              Tu contraseña se ha cambiado correctamente. Redirigiendo…
            </p>
          </div>
          <div className="w-8 h-1.5 rounded-full bg-[#0ea5a0] animate-pulse" />
        </div>
      </div>
    )
  }

  if (!sesionOk) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center text-4xl">⚠️</div>
          <div>
            <h1 className="text-xl font-bold text-[#1a3c5e]">Enlace inválido o expirado</h1>
            <p className="text-[#6b7280] text-sm mt-2">
              Este enlace de recuperación ya no es válido. Solicita uno nuevo.
            </p>
          </div>
          <Link
            href="/recuperar"
            className="flex items-center gap-2 bg-gradient-to-r from-[#1a3c5e] to-[#2d5a8e] text-white font-bold px-6 py-3 rounded-2xl text-sm"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0ea5a0] to-[#0c8e8a] flex items-center justify-center text-2xl mx-auto mb-4 shadow-md">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-[#1a3c5e]">Nueva contraseña</h1>
          <p className="text-[#6b7280] text-sm mt-2">Elige una contraseña segura para tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1a3c5e] ml-1">Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              autoFocus
              className="px-4 py-3.5 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1a3c5e] ml-1">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Repite la contraseña"
              required
              className={`px-4 py-3.5 rounded-xl border-2 bg-[#f4f5f7] text-sm outline-none transition-all
                ${confirmar && confirmar !== password
                  ? 'border-red-400 bg-red-50'
                  : confirmar && confirmar === password
                  ? 'border-[#0ea5a0] bg-[#f0fafa]'
                  : 'border-transparent focus:border-[#1a3c5e] focus:bg-white'}`}
            />
            {confirmar && confirmar !== password && (
              <p className="text-xs text-red-500 ml-1">Las contraseñas no coinciden</p>
            )}
          </div>

          {/* Indicador de seguridad */}
          {password.length > 0 && (
            <div className="flex items-center gap-2">
              {[4, 6, 8, 12].map((min, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    password.length >= min ? 'bg-[#0ea5a0]' : 'bg-gray-200'
                  }`}
                />
              ))}
              <span className="text-[10px] text-[#9ca3af] whitespace-nowrap">
                {password.length < 6 ? 'Débil' : password.length < 8 ? 'Media' : 'Fuerte'}
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || password.length < 6 || password !== confirmar}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0ea5a0] to-[#0c8e8a] text-white font-bold py-3.5 rounded-2xl hover:from-[#0c8e8a] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                </svg>
                Guardando…
              </>
            ) : '🔒 Guardar nueva contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
