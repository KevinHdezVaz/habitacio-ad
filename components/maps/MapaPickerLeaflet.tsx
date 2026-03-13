'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import type { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix de iconos de Leaflet con webpack/Next.js
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet')
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

// Andorra centrada
const ANDORRA_CENTER: [number, number] = [42.5063, 1.5218]

function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface MapaPickerLeafletProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

export default function MapaPickerLeaflet({ lat, lng, onChange }: MapaPickerLeafletProps) {
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [marker, setMarker] = useState<[number, number] | null>(
    lat && lng ? [lat, lng] : null
  )
  const [mapRef, setMapRef] = useState<import('leaflet').Map | null>(null)

  useEffect(() => {
    fixLeafletIcons()
  }, [])

  async function buscarDireccion() {
    if (!search.trim()) return
    setSearching(true)
    try {
      const q = encodeURIComponent(`${search.trim()}, Andorra`)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=ad`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await res.json()
      if (data[0]) {
        const newLat = parseFloat(data[0].lat)
        const newLng = parseFloat(data[0].lon)
        setMarker([newLat, newLng])
        onChange(newLat, newLng)
        mapRef?.setView([newLat, newLng], 16)
      }
    } catch { /* silencio */ } finally {
      setSearching(false)
    }
  }

  function handleSelect(newLat: number, newLng: number) {
    setMarker([newLat, newLng])
    onChange(newLat, newLng)
  }

  function handleDrag(e: { target: { getLatLng: () => LatLng } }) {
    const { lat: newLat, lng: newLng } = e.target.getLatLng()
    setMarker([newLat, newLng])
    onChange(newLat, newLng)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Buscador de dirección */}
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), buscarDireccion())}
          placeholder="Buscar calle, zona o edificio en Andorra…"
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#f4f5f7] text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#0ea5a0]/30 transition-all"
        />
        <button
          type="button"
          onClick={buscarDireccion}
          disabled={searching}
          className="px-4 py-2.5 bg-[#1a3c5e] text-white text-sm font-semibold rounded-xl hover:bg-[#152e4a] transition-colors disabled:opacity-50"
        >
          {searching ? '…' : 'Buscar'}
        </button>
      </div>

      {/* Mapa */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 relative" style={{ height: 300 }}>
        <MapContainer
          center={marker ?? ANDORRA_CENTER}
          zoom={marker ? 15 : 12}
          style={{ height: '100%', width: '100%' }}
          ref={setMapRef}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={handleSelect} />
          {marker && (
            <Marker
              position={marker}
              draggable
              eventHandlers={{ dragend: handleDrag }}
            />
          )}
        </MapContainer>

        {/* Instrucción flotante */}
        {!marker && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-[#1a3c5e]/90 text-white text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none">
            Toca el mapa para colocar el pin
          </div>
        )}
      </div>

      {/* Coordenadas seleccionadas */}
      {marker ? (
        <p className="text-xs text-[#6b7280] flex items-center gap-1.5">
          <span className="text-[#0ea5a0]">✓</span>
          Ubicación guardada — {marker[0].toFixed(5)}, {marker[1].toFixed(5)}
          <button
            type="button"
            onClick={() => { setMarker(null); onChange(0, 0) }}
            className="ml-1 text-[#9ca3af] hover:text-red-500 transition-colors"
          >
            Eliminar
          </button>
        </p>
      ) : (
        <p className="text-xs text-[#9ca3af]">
          Sin ubicación exacta — se mostrará la zona de la parroquia seleccionada.
        </p>
      )}
    </div>
  )
}
