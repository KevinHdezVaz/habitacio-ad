'use client'

import { useState } from 'react'

interface Props {
  anuncio: {
    precio: number
    importe_fianza?: number | null
    fianza: boolean
    gastos_incluidos: boolean
    wifi: boolean
    calefaccion?: string | null
    bano_privado: boolean
    tipo_cama?: string | null
    metros_habitacion?: number | null
    metros_piso?: number | null
    superficie_m2?: number | null
    estancia_minima?: number | null
    estancia_maxima?: number | null
    amueblada?: boolean | null
    armario?: boolean | null
    escritorio?: boolean | null
    exterior?: boolean | null
    balcon_ventana?: boolean | null
    num_habitaciones?: number | null
    num_banos?: number | null
    num_personas?: number | null
    vive_propietario?: boolean | null
    ascensor?: boolean | null
    parking?: boolean | null
    terraza?: boolean | null
    admite_pareja?: boolean | null
    admite_mascotas?: boolean | null
    fumadores?: boolean | null
    empadronamiento?: boolean | null
    preferencia_sexo?: string | null
    idioma_vivienda?: string | null
    duracion_minima?: string | null
    disponible_desde?: string | null
  }
  disponibleDesde: string | null
}

// ─── Item de detalle compacto ──────────────────────────────────────────────
function DetalleItem({ icon, label, value, positive }: {
  icon: string; label: string; value: string; positive?: boolean
}) {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-base w-6 flex-shrink-0 text-center">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-[#9ca3af] uppercase tracking-wide leading-none">{label}</p>
        <p className={`text-sm font-semibold leading-snug mt-0.5 ${
          positive === true ? 'text-[#0ea5a0]' :
          positive === false ? 'text-[#9ca3af]' :
          'text-[#1a3c5e]'
        }`}>{value}</p>
      </div>
    </div>
  )
}

// ─── Sección acordeón ─────────────────────────────────────────────────────
function AccordionSection({
  title, defaultOpen = true, children,
}: {
  title: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-5 text-left"
      >
        <h2 className="text-base font-bold text-[#1a3c5e] flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#0ea5a0] inline-block flex-shrink-0" />
          {title}
        </h2>
        <svg
          className={`w-4 h-4 text-[#9ca3af] transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-gray-50">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Gastos colapsables dentro de Condiciones ─────────────────────────────
function GastosItem({ gastos_incluidos, wifi, calefaccion }: {
  gastos_incluidos: boolean; wifi: boolean; calefaccion?: string | null
}) {
  const [open, setOpen] = useState(false)

  const calefaccionLabel =
    calefaccion === 'incluida' ? 'Incluida' :
    calefaccion === 'si' ? 'Sí, hay calefacción' :
    'No incluida'

  return (
    <div className="col-span-2 border-t border-gray-50 first:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-base w-6 text-center">💡</span>
          <div>
            <p className="text-[10px] text-[#9ca3af] uppercase tracking-wide leading-none">Gastos</p>
            <p className={`text-sm font-semibold leading-snug mt-0.5 ${gastos_incluidos ? 'text-[#0ea5a0]' : 'text-[#1a3c5e]'}`}>
              {gastos_incluidos ? 'Incluidos' : 'No incluidos'}
            </p>
          </div>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-[#9ca3af] transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="ml-8 mb-2 flex flex-col gap-1 text-sm">
          <p className="text-[#4b5563]">
            <span className="text-[#9ca3af] text-xs">WiFi: </span>
            <span className={`font-semibold ${wifi ? 'text-[#0ea5a0]' : 'text-[#9ca3af]'}`}>
              {wifi ? 'Incluido' : 'No incluido'}
            </span>
          </p>
          <p className="text-[#4b5563]">
            <span className="text-[#9ca3af] text-xs">Calefacción: </span>
            <span className={`font-semibold ${calefaccion === 'incluida' ? 'text-[#0ea5a0]' : 'text-[#1a3c5e]'}`}>
              {calefaccionLabel}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ──────────────────────────────────────────────────
export default function DetallesColapsables({ anuncio, disponibleDesde }: Props) {
  const superficie = anuncio.metros_habitacion ?? anuncio.superficie_m2 ?? null

  const preferenciaSexoLabel =
    anuncio.preferencia_sexo === 'chicas' ? 'Solo chicas' :
    anuncio.preferencia_sexo === 'chicos' ? 'Solo chicos' :
    'Sin preferencia'

  const calefaccionLabel =
    anuncio.calefaccion === 'incluida' ? 'Incluida' :
    anuncio.calefaccion === 'si' ? 'Sí, hay' :
    'No'

  return (
    <div className="flex flex-col gap-3">

      {/* ── Quick stats chips (siempre visibles) ── */}
      <div className="flex flex-wrap gap-2">
        {superficie && (
          <span className="flex items-center gap-1.5 text-xs font-semibold bg-[#f4f5f7] text-[#374151] px-3 py-1.5 rounded-xl">
            📐 {superficie} m²
          </span>
        )}
        {anuncio.tipo_cama && (
          <span className="flex items-center gap-1.5 text-xs font-semibold bg-[#f4f5f7] text-[#374151] px-3 py-1.5 rounded-xl">
            🛌 Cama {anuncio.tipo_cama.toLowerCase()}
          </span>
        )}
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl ${
          anuncio.bano_privado ? 'bg-[#e6f7f7] text-[#0ea5a0]' : 'bg-[#f4f5f7] text-[#374151]'
        }`}>
          🚿 Baño {anuncio.bano_privado ? 'privado' : 'compartido'}
        </span>
        {anuncio.num_personas && (
          <span className="flex items-center gap-1.5 text-xs font-semibold bg-[#f4f5f7] text-[#374151] px-3 py-1.5 rounded-xl">
            👥 {anuncio.num_personas} personas
          </span>
        )}
      </div>

      {/* ── Sobre la habitación ── */}
      <AccordionSection title="Sobre la habitación" defaultOpen>
        <div className="grid grid-cols-2 divide-y divide-gray-50">
          {disponibleDesde && (
            <DetalleItem icon="📅" label="Disponible desde" value={disponibleDesde} />
          )}
          {anuncio.estancia_minima && (
            <DetalleItem icon="📅" label="Estancia mínima" value={`${anuncio.estancia_minima} mes${anuncio.estancia_minima > 1 ? 'es' : ''}`} />
          )}
          {anuncio.estancia_maxima && (
            <DetalleItem icon="📅" label="Estancia máxima" value={`${anuncio.estancia_maxima} mes${anuncio.estancia_maxima > 1 ? 'es' : ''}`} />
          )}
          {superficie && (
            <DetalleItem icon="📐" label="m² habitación" value={`${superficie} m²`} />
          )}
          {anuncio.amueblada !== null && anuncio.amueblada !== undefined && (
            <DetalleItem icon="🪑" label="Amueblada" value={anuncio.amueblada ? 'Sí' : 'No'} positive={!!anuncio.amueblada} />
          )}
          {anuncio.tipo_cama && (
            <DetalleItem icon="🛌" label="Tipo de cama" value={anuncio.tipo_cama} />
          )}
          {anuncio.armario !== null && anuncio.armario !== undefined && (
            <DetalleItem icon="🚪" label="Armario" value={anuncio.armario ? 'Sí' : 'No'} positive={!!anuncio.armario} />
          )}
          {anuncio.escritorio !== null && anuncio.escritorio !== undefined && (
            <DetalleItem icon="💻" label="Escritorio" value={anuncio.escritorio ? 'Sí' : 'No'} positive={!!anuncio.escritorio} />
          )}
          {anuncio.exterior !== null && anuncio.exterior !== undefined && (
            <DetalleItem icon="☀️" label="Orientación" value={anuncio.exterior ? 'Exterior' : 'Interior'} positive={!!anuncio.exterior} />
          )}
          {anuncio.balcon_ventana !== null && anuncio.balcon_ventana !== undefined && (
            <DetalleItem icon="🪟" label="Balcón o ventana" value={anuncio.balcon_ventana ? 'Sí' : 'No'} positive={!!anuncio.balcon_ventana} />
          )}
          <DetalleItem icon="🚿" label="Baño" value={anuncio.bano_privado ? 'Privado' : 'Compartido'} positive={!!anuncio.bano_privado} />
        </div>
      </AccordionSection>

      {/* ── Sobre la vivienda ── */}
      <AccordionSection title="Sobre la vivienda" defaultOpen>
        <div className="grid grid-cols-2 divide-y divide-gray-50">
          {anuncio.num_habitaciones && (
            <DetalleItem icon="🛏️" label="Habitaciones" value={String(anuncio.num_habitaciones)} />
          )}
          {anuncio.num_banos && (
            <DetalleItem icon="🚿" label="Baños" value={String(anuncio.num_banos)} />
          )}
          {anuncio.num_personas && (
            <DetalleItem icon="👥" label="Personas" value={String(anuncio.num_personas)} />
          )}
          {anuncio.vive_propietario !== null && anuncio.vive_propietario !== undefined && (
            <DetalleItem icon="🏡" label="Propietario en vivienda" value={anuncio.vive_propietario ? 'Sí' : 'No'} />
          )}
          {anuncio.ascensor !== null && anuncio.ascensor !== undefined && (
            <DetalleItem icon="🛗" label="Ascensor" value={anuncio.ascensor ? 'Sí' : 'No'} positive={!!anuncio.ascensor} />
          )}
          {anuncio.parking !== null && anuncio.parking !== undefined && (
            <DetalleItem icon="🅿️" label="Parking" value={anuncio.parking ? 'Sí' : 'No'} positive={!!anuncio.parking} />
          )}
          {anuncio.terraza !== null && anuncio.terraza !== undefined && (
            <DetalleItem icon="🌿" label="Terraza" value={anuncio.terraza ? 'Sí' : 'No'} positive={!!anuncio.terraza} />
          )}
          <DetalleItem icon="🔥" label="Calefacción" value={calefaccionLabel} positive={anuncio.calefaccion === 'incluida'} />
        </div>
      </AccordionSection>

      {/* ── Condiciones ── */}
      <AccordionSection title="Condiciones" defaultOpen>
        <div className="grid grid-cols-2 divide-y divide-gray-50">

          {/* Gastos colapsable — ocupa columna completa */}
          <GastosItem
            gastos_incluidos={anuncio.gastos_incluidos}
            wifi={anuncio.wifi}
            calefaccion={anuncio.calefaccion}
          />

          <DetalleItem
            icon="🔐"
            label="Fianza"
            value={anuncio.fianza
              ? (anuncio.importe_fianza ? `${anuncio.importe_fianza} €` : 'Sí')
              : 'Sin fianza'}
            positive={!anuncio.fianza}
          />
          <DetalleItem
            icon="👫"
            label="Se aceptan parejas"
            value={anuncio.admite_pareja ? 'Sí' : 'No'}
            positive={!!anuncio.admite_pareja}
          />
          <DetalleItem
            icon="🐾"
            label="Se aceptan mascotas"
            value={anuncio.admite_mascotas ? 'Sí' : 'No'}
            positive={!!anuncio.admite_mascotas}
          />
          <DetalleItem
            icon="🚬"
            label="Se permite fumar"
            value={anuncio.fumadores ? 'Sí' : 'No'}
            positive={!anuncio.fumadores}
          />
          <DetalleItem
            icon="📄"
            label="Empadronamiento"
            value={anuncio.empadronamiento ? 'Posible' : 'No disponible'}
            positive={!!anuncio.empadronamiento}
          />
          {anuncio.preferencia_sexo && (
            <DetalleItem
              icon="💁"
              label="Perfil preferido"
              value={preferenciaSexoLabel}
            />
          )}
          {anuncio.idioma_vivienda && (
            <DetalleItem icon="🗣️" label="Idioma" value={anuncio.idioma_vivienda} />
          )}
          {anuncio.duracion_minima && (
            <DetalleItem icon="📅" label="Duración mínima" value={anuncio.duracion_minima} />
          )}
        </div>
      </AccordionSection>

    </div>
  )
}
