import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/panel/',
          '/mi-perfil/',
          '/mensajes/',
          '/chat/',
        ],
      },
    ],
    sitemap: 'https://habitacio.ad/sitemap.xml',
    host: 'https://habitacio.ad',
  }
}
