'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

interface AvatarUploadProps {
  userId: string
  avatarUrl?: string | null
  nombre: string
  size?: 'md' | 'lg'
}

export default function AvatarUpload({
  userId,
  avatarUrl: initialUrl,
  nombre,
  size = 'lg',
}: AvatarUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null)
  const [error, setError] = useState<string | null>(null)

  const iniciales = nombre
    ? nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const sizeClass = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-16 h-16 text-xl'
  const iconSize  = size === 'lg' ? 'w-8 h-8'             : 'w-6 h-6'

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5 MB.')
      return
    }

    // Preview instantáneo
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const ext  = file.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/avatar.${ext}`

      // Subir a Storage (bucket: avatars — público)
      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadErr) throw uploadErr

      // Obtener URL pública con cache-buster
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)

      const publicUrl = `${urlData.publicUrl}?v=${Date.now()}`

      // Guardar en profiles
      const { error: dbErr } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (dbErr) throw dbErr

      setPreview(publicUrl)
    } catch {
      setError('Error al subir la imagen. Inténtalo de nuevo.')
      setPreview(initialUrl ?? null)
    } finally {
      setUploading(false)
      // Reset input para poder volver a seleccionar el mismo archivo
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {/* Avatar circular con overlay de cámara */}
      <button
        type="button"
        onClick={() => !uploading && fileRef.current?.click()}
        className={`relative ${sizeClass} rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5a0] focus-visible:ring-offset-2`}
        aria-label="Cambiar foto de perfil"
      >
        {/* Imagen o iniciales */}
        {preview ? (
          <img
            src={preview}
            alt={nombre}
            className={`${sizeClass} rounded-full object-cover`}
          />
        ) : (
          <div className={`${sizeClass} rounded-full bg-gradient-to-br from-[#1a3c5e] to-[#2d5a8e] flex items-center justify-center text-white font-bold select-none`}>
            {iniciales}
          </div>
        )}

        {/* Overlay de cámara (hover o cargando) */}
        <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all
          ${uploading
            ? 'bg-black/50'
            : 'bg-black/0 group-hover:bg-black/40'}`}
        >
          {uploading ? (
            /* Spinner mientras sube */
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-white/30" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
            </div>
          ) : (
            /* Icono cámara */
            <div className={`${iconSize} text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          )}
        </div>

        {/* Badge de edición */}
        {!uploading && (
          <span className="absolute bottom-0.5 right-0.5 w-6 h-6 bg-[#0ea5a0] rounded-full border-2 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"/>
            </svg>
          </span>
        )}
      </button>

      {/* Label de acción */}
      <p className="text-[11px] text-[#9ca3af]">
        {uploading ? 'Subiendo…' : 'Toca para cambiar'}
      </p>

      {error && (
        <p className="text-xs text-red-500 text-center max-w-[160px]">{error}</p>
      )}
    </div>
  )
}
