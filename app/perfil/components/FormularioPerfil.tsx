'use client'

import { useState } from 'react'
import { actualizarPerfil } from '@/app/actions/perfil'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Profile } from '@/types'

export default function FormularioPerfil({
  profile,
  email,
}: {
  profile: Profile & { descripcion?: string }
  email: string
}) {
  const [loading, setLoading]   = useState(false)
  const [exito, setExito]       = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setExito(false)
    setError(null)

    const res = await actualizarPerfil(new FormData(e.currentTarget))

    if (res?.error) setError(res.error)
    else setExito(true)

    setLoading(false)
  }

  const badgeTipo: Record<string, string> = {
    arrendador: 'bg-blue-100 text-[#1a3c5e]',
    inquilino:  'bg-teal-100 text-[#0ea5a0]',
    admin:      'bg-purple-100 text-purple-700',
  }
  const labelTipo: Record<string, string> = {
    arrendador: 'Propietario',
    inquilino:  'Inquilino',
    admin:      'Admin',
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <h2 className="font-bold text-[#1a3c5e] text-lg flex-1">Información personal</h2>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${badgeTipo[profile.tipo] ?? 'bg-gray-100 text-gray-600'}`}>
          {labelTipo[profile.tipo] ?? profile.tipo}
        </span>
      </div>

      <Input
        label="Nombre completo"
        name="nombre"
        defaultValue={profile.nombre ?? ''}
        required
      />

      <Input
        label="Email"
        name="email"
        defaultValue={email}
        readOnly
        className="opacity-60 cursor-not-allowed"
      />

      <Input
        label="Teléfono (opcional)"
        name="telefono"
        type="tel"
        defaultValue={profile.telefono ?? ''}
        placeholder="+376 600 000"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-[#1a3c5e] ml-1">Sobre mí (opcional)</label>
        <textarea
          name="descripcion"
          defaultValue={(profile as { descripcion?: string }).descripcion ?? ''}
          placeholder="Cuéntanos un poco sobre ti, qué buscas, tu trabajo…"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-transparent bg-[#f4f5f7] text-sm focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 focus:outline-none transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}
      {exito && (
        <p className="text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-xl">
          ✓ Cambios guardados correctamente.
        </p>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}
