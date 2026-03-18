'use client'

import { useEffect, useRef, useState } from 'react'

// Andorra centrada
const ANDORRA_CENTER = { lat: 42.5063, lng: 1.5218 }

interface MapaPickerLeafletProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

export default function MapaPickerLeaflet({ lat, lng, onChange }: MapaPickerLeafletProps) {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const onChangeRef = useRef(onChange)
  const initializedRef = useRef(false)

  const [loaded, setLoaded] = useState(false)
  const [hasMarker, setHasMarker] = useState(!!(lat && lng))
  const [error, setError] = useState<string | null>(null)

  // Mantener onChange actualizado sin re-renderizar
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setError('API key no configurada')
      return
    }

    function initMap() {
      if (initializedRef.current) return
      if (!mapDivRef.current || !inputRef.current) return
      if (!window.google?.maps) return

      initializedRef.current = true

      const center = (lat && lng) ? { lat, lng } : ANDORRA_CENTER

      const map = new window.google.maps.Map(mapDivRef.current, {
        center,
        zoom: (lat && lng) ? 15 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
      })

      let marker: google.maps.Marker | null = null

      function placeMarker(position: { lat: number; lng: number }) {
        if (marker) {
          marker.setPosition(position)
        } else {
          marker = new window.google.maps.Marker({
            position,
            map,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
          })
          marker.addListener('dragend', () => {
            const pos = marker!.getPosition()
            if (pos) {
              onChangeRef.current(pos.lat(), pos.lng())
            }
          })
        }
        map.panTo(position)
        onChangeRef.current(position.lat, position.lng)
        setHasMarker(true)
      }

      // Marker inicial si hay coordenadas guardadas
      if (lat && lng) {
        placeMarker({ lat, lng })
      }

      // Click en el mapa
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          placeMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() })
        }
      })

      // Places Autocomplete (búsqueda global)
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
        fields: ['geometry', 'name', 'formatted_address'],
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.geometry?.location) {
          const pos = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
          placeMarker(pos)
          map.setZoom(16)
        }
      })

      // Exponer función eliminar marcador
      ;(mapDivRef.current as HTMLDivElement & { _clearMarker?: () => void })._clearMarker = () => {
        marker?.setMap(null)
        marker = null
        setHasMarker(false)
        onChangeRef.current(0, 0)
        if (inputRef.current) inputRef.current.value = ''
      }

      setLoaded(true)
    }

    // Si Google Maps ya está cargado en la página
    if (window.google?.maps?.places) {
      initMap()
      return
    }

    // Evitar cargar el script dos veces
    const existingScript = document.getElementById('gmaps-sdk')
    if (existingScript) {
      // El script ya se añadió pero aún está cargando — esperar
      existingScript.addEventListener('load', initMap)
      return () => existingScript.removeEventListener('load', initMap)
    }

    // Cargar el script de Google Maps
    const script = document.createElement('script')
    script.id = 'gmaps-sdk'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es`
    script.async = true
    script.defer = true
    script.onload = initMap
    script.onerror = () => setError('No se pudo cargar Google Maps')
    document.head.appendChild(script)

    return () => {
      script.removeEventListener('load', initMap)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClearMarker() {
    const el = mapDivRef.current as HTMLDivElement & { _clearMarker?: () => void }
    el?._clearMarker?.()
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
          placeholder="Busca cualquier dirección o lugar del mundo…"
          className="flex-1 bg-transparent text-sm outline-none text-[#1a3c5e] placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Mapa */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 relative" style={{ height: 300 }}>
        <div ref={mapDivRef} style={{ height: '100%', width: '100%' }} />

        {/* Instrucción flotante */}
        {loaded && !hasMarker && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-[#1a3c5e]/90 text-white text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap">
            Busca arriba o toca el mapa para colocar el pin
          </div>
        )}

        {/* Loading */}
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f4f5f7]">
            <svg className="w-6 h-6 animate-spin text-[#0ea5a0]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f4f5f7] gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-[#9ca3af]">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-xs text-[#9ca3af]">{error}</p>
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
