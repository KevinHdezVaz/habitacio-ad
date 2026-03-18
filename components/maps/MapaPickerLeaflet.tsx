'use client'

import { useEffect, useRef, useState } from 'react'
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

type Suggestion = {
  display_name: string
  lat: number
  lng: number
}

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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [marker, setMarker] = useState<[number, number] | null>(
    lat && lng ? [lat, lng] : null
  )
  const [mapRef, setMapRef] = useState<import('leaflet').Map | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fixLeafletIcons()
  }, [])

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Autocomplete con Nominatim (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!search.trim() || search.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true)
      try {
        const q = encodeURIComponent(`${search.trim()}, Andorra`)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&accept-language=es`,
          { headers: { 'Accept-Language': 'es' } }
        )
        const data = await res.json()
        const results: Suggestion[] = (data ?? []).map((item: { display_name: string; lat: string; lon: string }) => ({
          display_name: item.display_name.replace(/, Andorra$/, '').replace(/, AD$/, ''),
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }))
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch { /* silencio */ } finally {
        setLoadingSuggestions(false)
      }
    }, 350)
  }, [search])

  function selectSuggestion(s: Suggestion) {
    setMarker([s.lat, s.lng])
    onChange(s.lat, s.lng)
    mapRef?.setView([s.lat, s.lng], 16)
    setSearch(s.display_name)
    setShowSuggestions(false)
  }

  function handleSelect(newLat: number, newLng: number) {
    setMarker([newLat, newLng])
    onChange(newLat, newLng)
    setShowSuggestions(false)
  }

  function handleDrag(e: { target: { getLatLng: () => LatLng } }) {
    const { lat: newLat, lng: newLng } = e.target.getLatLng()
    setMarker([newLat, newLng])
    onChange(newLat, newLng)
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Buscador con autocomplete */}
      <div className="relative" ref={wrapperRef}>
        <div className="flex gap-2 items-center bg-[#f4f5f7] rounded-xl px-3 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0ea5a0]/30 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#9ca3af] flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true) }}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowSuggestions(false)
              if (e.key === 'Enter') { e.preventDefault(); if (suggestions[0]) selectSuggestion(suggestions[0]) }
            }}
            placeholder="Busca calle, zona o edificio en Andorra…"
            className="flex-1 bg-transparent text-sm outline-none text-[#1a3c5e] placeholder:text-[#9ca3af]"
          />
          {loadingSuggestions && (
            <svg className="w-4 h-4 animate-spin text-[#0ea5a0] flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
          )}
          {search && !loadingSuggestions && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSuggestions([]); setShowSuggestions(false) }}
              className="text-[#9ca3af] hover:text-[#374151] transition-colors flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-3.5 h-3.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown de sugerencias */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-gray-100 shadow-lg z-[9999] overflow-hidden">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s) }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-[#f8fafc] transition-colors flex items-start gap-3 border-b border-gray-50 last:border-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#0ea5a0] flex-shrink-0 mt-0.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-[#374151] leading-snug line-clamp-2">{s.display_name}</span>
              </button>
            ))}
          </div>
        )}
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
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-[#1a3c5e]/90 text-white text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap">
            Busca arriba o toca el mapa para colocar el pin
          </div>
        )}
      </div>

      {/* Estado de ubicación */}
      {marker ? (
        <div className="flex items-center justify-between bg-[#e6f7f7] rounded-xl px-3 py-2">
          <p className="text-xs text-[#0ea5a0] font-semibold flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Ubicación guardada
          </p>
          <button
            type="button"
            onClick={() => { setMarker(null); onChange(0, 0); setSearch('') }}
            className="text-xs text-[#9ca3af] hover:text-red-500 transition-colors font-medium"
          >
            Eliminar
          </button>
        </div>
      ) : (
        <p className="text-xs text-[#9ca3af]">
          Sin ubicación exacta — se mostrará la zona de la parroquia seleccionada.
        </p>
      )}
    </div>
  )
}
