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
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/registro`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/legal/aviso-legal`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/legal/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/legal/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  return [...rutasEstaticas, ...fichasHabitacion]
}
