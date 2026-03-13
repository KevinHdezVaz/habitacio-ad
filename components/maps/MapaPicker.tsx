'use client'

import dynamic from 'next/dynamic'
import Spinner from '@/components/ui/Spinner'

// Leaflet no puede correr en SSR — cargamos sólo en cliente
const MapaPickerLeaflet = dynamic(() => import('./MapaPickerLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center rounded-2xl bg-[#f4f5f7]" style={{ height: 300 }}>
      <Spinner size="md" color="blue" />
    </div>
  ),
})

interface MapaPickerProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

export default function MapaPicker(props: MapaPickerProps) {
  return <MapaPickerLeaflet {...props} />
}
