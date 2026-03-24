import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import TarjetaHabitacion from '@/components/habitaciones/TarjetaHabitacion'

const PARROQUIAS: Record<string, string> = {
  'andorra-la-vella': 'Andorra la Vella',
  'escaldes-engordany': 'Escaldes-Engordany',
  'encamp': 'Encamp',
  'la-massana': 'La Massana',
  'canillo': 'Canillo',
  'ordino': 'Ordino',
  'sant-julia-de-loria': 'Sant Julià de Lòria',
}

export async function generateStaticParams() {
  return Object.keys(PARROQUIAS).map((slug) => ({ parroquia: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ parroquia: string }>
}): Promise<Metadata> {
  const { parroquia: slug } = await params
  const nombre = PARROQUIAS[slug]
  if (!nombre) return {}

  return {
    title: `Habitaciones en ${nombre} — Andorra`,
    description: `Alquiler de habitaciones en ${nombre}, Andorra. Anuncios de particulares con precio, fotos y condiciones. Todo el año o temporada.`,
    alternates: {
      canonical: `https://habitacio.ad/habitaciones/${slug}`,
      languages: {
        'es': `https://habitacio.ad/habitaciones/${slug}`,
        'ca': `https://habitacio.ad/habitaciones/${slug}`,
      },
    },
    openGraph: {
      title: `Habitaciones en ${nombre} | Habitacio.ad`,
      description: `Alquiler de habitaciones en ${nombre}, Andorra.`,
      url: `https://habitacio.ad/habitaciones/${slug}`,
    },
  }
}

export default async function ParroquiaPage({
  params,
}: {
  params: Promise<{ parroquia: string }>
}) {
  const { parroquia: slug } = await params
  const nombre = PARROQUIAS[slug]
  if (!nombre) notFound()

  const supabase = await createClient()
  const { data: anuncios } = await supabase
    .from('anuncios')
    .select(`
      id, titulo, parroquia, zona, precio,
      tipo_estancia, gastos_incluidos, bano_privado, wifi,
      disponible_desde, metros_habitacion, fumadores,
      imagenes_anuncio (url, orden)
    `)
    .eq('estado', 'activo')
    .eq('parroquia', nombre)
    .order('created_at', { ascending: false })

  const lista = anuncios ?? []

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#6b7280]">
        <Link href="/habitaciones" className="hover:text-[#1a3c5e] transition-colors">Habitaciones</Link>
        <span className="mx-2">·</span>
        <span className="text-[#1a3c5e] font-medium">{nombre}</span>
      </nav>

      {/* H1 SEO */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3c5e]">
          Habitaciones en alquiler en {nombre}
        </h1>
        <p className="text-[#6b7280] mt-1 text-sm">
          {lista.length > 0
            ? `${lista.length} anuncio${lista.length !== 1 ? 's' : ''} disponible${lista.length !== 1 ? 's' : ''} en ${nombre}`
            : `Anuncios de habitación en ${nombre}, Andorra`}
        </p>
      </div>

      {/* Listado */}
      {lista.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lista.map((anuncio: any) => (
            <TarjetaHabitacion key={anuncio.id} anuncio={anuncio} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-[#f4f5f7] flex items-center justify-center text-3xl">🏠</div>
          <div>
            <p className="font-bold text-[#1a3c5e]">Sin anuncios en {nombre} todavía</p>
            <p className="text-sm text-[#6b7280] mt-1">Sé el primero en publicar una habitación aquí.</p>
          </div>
          <Link
            href="/publicar"
            className="mt-2 px-5 py-2.5 bg-[#1a3c5e] text-white text-sm font-semibold rounded-xl hover:bg-[#0ea5a0] transition-colors"
          >
            Publicar habitación
          </Link>
        </div>
      )}

      {/* Enlazado interno — otras parroquias */}
      <div className="border-t border-gray-100 pt-6">
        <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-3">Buscar en otras zonas</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PARROQUIAS)
            .filter(([s]) => s !== slug)
            .map(([s, n]) => (
              <Link
                key={s}
                href={`/habitaciones/${s}`}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-sm text-[#374151] hover:border-[#1a3c5e] hover:text-[#1a3c5e] transition-colors"
              >
                {n}
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
