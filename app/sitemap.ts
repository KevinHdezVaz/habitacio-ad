import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

const BASE_URL = 'https://habitacio.ad'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Obtener todos los anuncios activos
  const { data: anuncios } = await supabase
    .from('anuncios')
    .select('id, updated_at')
    .eq('estado', 'activo')
    .order('updated_at', { ascending: false })

  const fichasHabitacion: MetadataRoute.Sitemap = (anuncios ?? []).map((a) => ({
    url: `${BASE_URL}/habitaciones/${a.id}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Rutas estáticas
  const rutasEstaticas: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/habitaciones`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/perfiles`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/buscar-habitacion`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/publicar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/aviso-legal`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  const parroquiaSlugs = [
    'andorra-la-vella',
    'escaldes-engordany',
    'encamp',
    'la-massana',
    'canillo',
    'ordino',
    'sant-julia-de-loria',
  ]

  const rutasParroquia: MetadataRoute.Sitemap = parroquiaSlugs.map((slug) => ({
    url: `${BASE_URL}/habitaciones/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  return [...rutasEstaticas, ...rutasParroquia, ...fichasHabitacion]
}
