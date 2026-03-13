'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase-browser'
import { publicarAnuncio } from '@/app/actions/anuncios'

const PARROQUIAS = [
  'Andorra la Vella', 'Escaldes-Engordany', 'Encamp',
  'Sant Julià de Lòria', 'La Massana', 'Ordino', 'Canillo',
]

export default function PublicarPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviews, setImagePreviews] = useState<{ file: File; preview: string }[]>([])

  // ── Form state ──
  const [form, setForm] = useState({
    titulo: '', parroquia: '', zona: '', precio: '',
    disponible_desde: '', tipo_estancia: 'anual',
    fianza: false, importe_fianza: '',
    gastos_incluidos: false, duracion_minima: '',
    metros_habitacion: '', metros_piso: '',
    num_personas: '', vive_propietario: false,
    admite_pareja: false, admite_mascotas: false,
    empadronamiento: false, fumadores: false,
    preferencia_sexo: 'indiferente',
    tipo_cama: '', bano_privado: false, wifi: true,
    idioma_vivienda: 'Español',
    descripcion: '', normas: '',
  })

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 8)
    const previews = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setImagePreviews((prev) => [...prev, ...previews].slice(0, 8))
  }

  function removeImage(index: number) {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titulo || !form.parroquia || !form.precio) {
      setError('Título, parroquia y precio son obligatorios.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/publicar'); return }

      // Subir imágenes a Supabase Storage
      const imageUrls: string[] = []
      for (const { file } of imagePreviews) {
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data, error: uploadError } = await supabase.storage
          .from('habitaciones') // Bucket en Supabase: Settings > Storage > New bucket "habitaciones" (public)
          .upload(path, file, { contentType: file.type, upsert: false })
        if (data) {
          const { data: urlData } = supabase.storage.from('habitaciones').getPublicUrl(data.path)
          imageUrls.push(urlData.publicUrl)
        } else {
          console.error('Upload error:', uploadError)
        }
      }

      // Crear anuncio
      const datos = {
        titulo: form.titulo,
        parroquia: form.parroquia,
        zona: form.zona || null,
        precio: Number(form.precio),
        disponible_desde: form.disponible_desde || null,
        tipo_estancia: form.tipo_estancia,
        fianza: form.fianza,
        importe_fianza: form.fianza && form.importe_fianza ? Number(form.importe_fianza) : null,
        gastos_incluidos: form.gastos_incluidos,
        duracion_minima: form.duracion_minima || null,
        metros_habitacion: form.metros_habitacion ? Number(form.metros_habitacion) : null,
        metros_piso: form.metros_piso ? Number(form.metros_piso) : null,
        num_personas: form.num_personas ? Number(form.num_personas) : null,
        vive_propietario: form.vive_propietario,
        admite_pareja: form.admite_pareja,
        admite_mascotas: form.admite_mascotas,
        empadronamiento: form.empadronamiento,
        fumadores: form.fumadores,
        preferencia_sexo: form.preferencia_sexo,
        tipo_cama: form.tipo_cama || null,
        bano_privado: form.bano_privado,
        wifi: form.wifi,
        idioma_vivienda: form.idioma_vivienda || null,
        descripcion: form.descripcion || null,
        normas: form.normas || null,
      }

      const result = await publicarAnuncio(datos, imageUrls)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
        return
      }
      router.push('/publicar/enviado')
    } catch {
      setError('Error inesperado. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  const toggle = (key: string) => set(key, !form[key as keyof typeof form])

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1a3c5e]">Publica tu anuncio</h1>
        <p className="text-[#6b7280] mt-1">Completa los detalles para encontrar al inquilino ideal.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* ── Información básica ── */}
        <Card className="p-6 flex flex-col gap-5">
          <h2 className="font-bold text-[#1a3c5e] text-base border-b border-gray-100 pb-3">Información básica</h2>
          <Input label="Título del anuncio *" placeholder="Ej: Habitación luminosa en el centro con balcón" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio mensual (€) *" type="number" placeholder="500" value={form.precio} onChange={(e) => set('precio', e.target.value)} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">Parroquia *</label>
              <select value={form.parroquia} onChange={(e) => set('parroquia', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm outline-none" required>
                <option value="">Selecciona...</option>
                {PARROQUIAS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Zona aproximada" placeholder="Ej: Cerca del centro comercial" value={form.zona} onChange={(e) => set('zona', e.target.value)} />
            <Input label="Disponible desde" type="date" value={form.disponible_desde} onChange={(e) => set('disponible_desde', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1a3c5e] ml-1">Tipo de estancia</label>
            <div className="flex gap-2">
              {[{ label: 'Anual', v: 'anual' }, { label: 'Temporero', v: 'temporero' }, { label: 'Ambos', v: 'ambos' }].map(({ label, v }) => (
                <button type="button" key={v} onClick={() => set('tipo_estancia', v)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${form.tipo_estancia === v ? 'bg-[#1a3c5e] text-white' : 'bg-[#f4f5f7] text-[#6b7280]'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ── Condiciones ── */}
        <Card className="p-6 flex flex-col gap-5">
          <h2 className="font-bold text-[#1a3c5e] text-base border-b border-gray-100 pb-3">Condiciones</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              {[
                { key: 'fianza', label: 'Requiere fianza' },
                { key: 'gastos_incluidos', label: 'Gastos incluidos' },
                { key: 'admite_pareja', label: 'Admite pareja' },
                { key: 'admite_mascotas', label: 'Admite mascotas' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => toggle(key)} className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form[key as keyof typeof form] ? 'bg-[#0ea5a0]' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key as keyof typeof form] ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className="text-sm text-[#1a3c5e]">{label}</span>
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {[
                { key: 'empadronamiento', label: 'Permite empadronamiento' },
                { key: 'fumadores', label: 'Se permite fumar' },
                { key: 'bano_privado', label: 'Baño privado' },
                { key: 'wifi', label: 'WiFi incluido' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => toggle(key)} className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form[key as keyof typeof form] ? 'bg-[#0ea5a0]' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key as keyof typeof form] ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className="text-sm text-[#1a3c5e]">{label}</span>
                </label>
              ))}
            </div>
          </div>
          {form.fianza && (
            <Input label="Importe de la fianza (€)" type="number" placeholder="Ej: 1000" value={form.importe_fianza} onChange={(e) => set('importe_fianza', e.target.value)} />
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duración mínima" placeholder="Ej: 3 meses" value={form.duracion_minima} onChange={(e) => set('duracion_minima', e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">Preferencia</label>
              <select value={form.preferencia_sexo} onChange={(e) => set('preferencia_sexo', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm outline-none">
                <option value="indiferente">Indiferente</option>
                <option value="chicas">Solo chicas</option>
                <option value="chicos">Solo chicos</option>
              </select>
            </div>
          </div>
        </Card>

        {/* ── Sobre la vivienda ── */}
        <Card className="p-6 flex flex-col gap-5">
          <h2 className="font-bold text-[#1a3c5e] text-base border-b border-gray-100 pb-3">Sobre la vivienda</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="Metros habitación" type="number" placeholder="12" value={form.metros_habitacion} onChange={(e) => set('metros_habitacion', e.target.value)} />
            <Input label="Metros piso" type="number" placeholder="80" value={form.metros_piso} onChange={(e) => set('metros_piso', e.target.value)} />
            <Input label="Personas viviendo" type="number" placeholder="3" value={form.num_personas} onChange={(e) => set('num_personas', e.target.value)} />
            <Input label="Tipo de cama" placeholder="Doble" value={form.tipo_cama} onChange={(e) => set('tipo_cama', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">Idioma principal</label>
              <select value={form.idioma_vivienda} onChange={(e) => set('idioma_vivienda', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm outline-none">
                <option>Español</option>
                <option>Catalán</option>
                <option>Francés</option>
                <option>Portugués</option>
                <option>Inglés</option>
                <option>Indiferente</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-6">
              <div onClick={() => toggle('vive_propietario')} className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.vive_propietario ? 'bg-[#0ea5a0]' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form.vive_propietario ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm text-[#1a3c5e]">Vive el propietario</span>
            </label>
          </div>
        </Card>

        {/* ── Descripción ── */}
        <Card className="p-6 flex flex-col gap-5">
          <h2 className="font-bold text-[#1a3c5e] text-base border-b border-gray-100 pb-3">Descripción y normas</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1a3c5e] ml-1">Descripción</label>
            <textarea value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} rows={4} placeholder="Cuéntanos sobre la habitación, el piso y el perfil de inquilino que buscas..." className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm outline-none resize-none focus:bg-white transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1a3c5e] ml-1">Normas de convivencia</label>
            <textarea value={form.normas} onChange={(e) => set('normas', e.target.value)} rows={3} placeholder="Horarios, limpieza, visitas, mascotas..." className="w-full px-4 py-3 rounded-xl bg-[#f4f5f7] text-sm outline-none resize-none focus:bg-white transition-colors" />
          </div>
        </Card>

        {/* ── Fotos ── */}
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="font-bold text-[#1a3c5e] text-base border-b border-gray-100 pb-3">Fotos de la habitación</h2>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {imagePreviews.map(({ preview }, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-black/70">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-2 hover:border-[#0ea5a0] transition-colors group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#f4f5f7] flex items-center justify-center text-2xl group-hover:bg-[#e6f7f7] transition-colors">📸</div>
            <p className="font-bold text-[#1a3c5e] text-sm">Añadir fotos</p>
            <p className="text-[#6b7280] text-xs">{imagePreviews.length}/8 fotos · Máximo 8</p>
          </button>
          <p className="text-xs text-[#9ca3af]">⚠️ Necesitas crear el bucket <strong>habitaciones</strong> en Supabase Storage con acceso público antes de subir imágenes.</p>
        </Card>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 py-3 px-4 rounded-xl text-center">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={loading} className="px-12">
            {loading ? 'Publicando...' : 'Enviar anuncio'}
          </Button>
        </div>
      </form>
    </div>
  )
}
