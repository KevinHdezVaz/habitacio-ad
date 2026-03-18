'use client'

import dynamic from 'next/dynamic'

// Google Maps usa window — cargamos sólo en cliente
const MapaPickerLeaflet = dynamic(() => import('./MapaPickerLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center rounded-2xl bg-[#f4f5f7]" style={{ height: 300 }}>
      <svg className="w-6 h-6 animate-spin text-[#0ea5a0]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
      </svg>
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
