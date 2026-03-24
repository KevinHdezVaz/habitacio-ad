import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Habitaciones en alquiler en Andorra',
  description: 'Encuentra habitación en alquiler en Andorra. Filtra por parroquia, precio y tipo de estancia. Anuncios actualizados de particulares y agencias.',
  alternates: {
    canonical: 'https://habitacio.ad/habitaciones',
    languages: {
      'es': 'https://habitacio.ad/habitaciones',
      'ca': 'https://habitacio.ad/habitaciones',
    },
  },
  openGraph: {
    title: 'Habitaciones en alquiler en Andorra | Habitacio.ad',
    description: 'Encuentra habitación en alquiler en Andorra. Filtra por parroquia, precio y tipo de estancia.',
    url: 'https://habitacio.ad/habitaciones',
  },
}

export default function HabitacionesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
