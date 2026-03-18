'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

declare global {
  interface Window {
    google: typeof google
    initGoogleMaps?: () => void
  }
}

// Andorra centrada
const ANDORRA_CENTER = { lat: 42.5063, lng: 1.5218 }

interface MapaPickerLeafletProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

export default function MapaPickerLeaflet({ lat, lng, onChange }: MapaPickerLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [hasMarker, setHasMarker] = useState(!!(lat && lng))

  const placeMarker = useCallback((position: google.maps.LatLngLiteral) => {
    if (!mapInstanceRef.current) return
    if (markerRef.current) {
      markerRef.current.setPosition(position)
    } else {
      markerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      })
      markerRef.current.addListener('dragend', () => {
        const pos = markerRef.current?.getPosition()
        if (pos) onChange(pos.lat(), pos.lng())
      })
    }
    mapInstanceRef.current.panTo(position)
    onChange(position.lat, position.lng)
    setHasMarker(true)
  }, [onChange])

  const initMap = useCallback(() => {
    if (!mapRef.current || !inputRef.current || !window.google) return

    const center = lat && lng ? { lat, lng } : ANDORRA_CENTER

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: lat && lng ? 15 : 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    })
    mapInstanceRef.current = map

    // Marker inicial si hay coords
    if (lat && lng) {
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      })
      markerRef.current.addListener('dragend', () => {
        const pos = markerRef.current?.getPosition()
        if (pos) onChange(pos.lat(), pos.lng())
      })
    }

    // Click en el mapa
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        placeMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      }
    })

    // Autocomplete Places
    const ac = new window.google.maps.places.Autocomplete(inputRef.current!, {
      fields: ['geometry', 'formatted_address', 'name'],
    })
    autocompleteRef.current = ac

    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      if (place.geometry?.location) {
        const pos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        placeMarker(pos)
        map.setZoom(16)
      }
    })

    setLoaded(true)
  }, [lat, lng, onChange, placeMarker])

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) return

    // Si ya está cargado
    if (window.google?.maps) {
      initMap()
      return
    }

    // Callback global
    window.initGoogleMaps = () => {
      initMap()
      delete window.initGoogleMaps
    }

    // Cargar script solo una vez
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script')
      script.id = 'google-maps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&language=es`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }, [initMap])

  function handleClearMarker() {
    markerRef.current?.setMap(null)
    markerRef.current = null
    setHasMarker(false)
    onChange(0, 0)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Buscador */}
      <div className="flex gap-2 items-center bg-[#f4f5f7] rounded-xl px-3 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0ea5a0]/30 transition-all">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#9ca3af] flex-shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Busca cualquier dirección o lugar…"
          className="flex-1 bg-transparent text-sm outline-none text-[#1a3c5e] placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Mapa */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 relative" style={{ height: 300 }}>
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

        {/* Instrucción flotante cuando no hay marker */}
        {loaded && !hasMarker && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-[#1a3c5e]/90 text-white text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap">
            Busca arriba o toca el mapa para colocar el pin
          </div>
        )}

        {/* Loading */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f4f5f7]">
            <svg className="w-6 h-6 animate-spin text-[#0ea5a0]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Estado de ubicación */}
      {hasMarker ? (
        <div className="flex items-center justify-between bg-[#e6f7f7] rounded-xl px-3 py-2">
          <p className="text-xs text-[#0ea5a0] font-semibold flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Ubicación guardada
          </p>
          <button
            type="button"
            onClick={handleClearMarker}
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
