import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/perfil/',
          '/chat/',
          '/publicar/',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://habitacio.ad/sitemap.xml',
  }
}
