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
function DetalleItem({ label, value }: {
  label: string; value: string
}) {
  return (
    <div className="flex items-start gap-2 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-[#9ca3af] uppercase tracking-wide leading-none">{label}</p>
        <p className="text-sm font-semibold leading-snug mt-0.5 text-[#1a3c5e]">{value}</p>
      </div>
    </div>
  )
}

// ─── Sección acordeón ─────────────────────────────────────────────────────
function AccordionSection({
  title, defaultOpen = false, children,
}: {
  title: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 px-5 text-left"
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
        <div className="min-w-0">
          <p className="text-[10px] text-[#9ca3af] uppercase tracking-wide leading-none">Gastos</p>
          <p className={`text-sm font-semibold leading-snug mt-0.5 ${gastos_incluidos ? 'text-[#0ea5a0]' : 'text-[#1a3c5e]'}`}>
            {gastos_incluidos ? 'Incluidos' : 'No incluidos'}
          </p>
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
        <div className="ml-0 mb-2 flex flex-col gap-1 text-sm border-l-2 border-[#e6f7f7] pl-3 ml-1">
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
      {/* ── Chips informativos básicos ── */}
      <div className="flex flex-wrap gap-2">
        {superficie && (
          <span className="text-xs font-semibold bg-[#f4f5f7] text-[#374151] px-3 py-1.5 rounded-xl">
            {superficie} m²
          </span>
        )}
        {anuncio.tipo_cama && (
          <span className="text-xs font-semibold bg-[#f4f5f7] text-[#374151] px-3 py-1.5 rounded-xl">
            Cama {anuncio.tipo_cama.toLowerCase()}
          </span>
        )}
        <span className="text-xs font-semibold bg-[#f4f5f7] text-[#374151] px-3 py-1.5 rounded-xl">
          Baño {anuncio.bano_privado ? 'privado' : 'compartido'}
        </span>
        {anuncio.num_personas && (
          <span className="text-xs font-semibold bg-[#f4f5f7] text-[#374151] px-3 py-1.5 rounded-xl">
            {anuncio.num_personas} personas
          </span>
        )}
      </div>

      {/* ── 5 características principales (siempre visibles) ── */}
      <div className="grid grid-cols-5 gap-2">
        {/* WiFi */}
        <div className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl border ${
          anuncio.wifi ? 'bg-[#eef2f8] border-[#c7d4e8]' : 'bg-[#f4f5f7] border-gray-100'
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className={`w-5 h-5 ${anuncio.wifi ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>
            <path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
          </svg>
          <span className={`text-[9px] font-semibold text-center leading-tight ${anuncio.wifi ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>WiFi</span>
        </div>

        {/* Gastos */}
        <div className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl border ${
          anuncio.gastos_incluidos ? 'bg-[#eef2f8] border-[#c7d4e8]' : 'bg-[#f4f5f7] border-gray-100'
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className={`w-5 h-5 ${anuncio.gastos_incluidos ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          <span className={`text-[9px] font-semibold text-center leading-tight ${anuncio.gastos_incluidos ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>Gastos{'\n'}incl.</span>
        </div>

        {/* Baño privado */}
        <div className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl border ${
          anuncio.bano_privado ? 'bg-[#eef2f8] border-[#c7d4e8]' : 'bg-[#f4f5f7] border-gray-100'
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className={`w-5 h-5 ${anuncio.bano_privado ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>
            <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/>
          </svg>
          <span className={`text-[9px] font-semibold text-center leading-tight ${anuncio.bano_privado ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>Baño{'\n'}privado</span>
        </div>

        {/* No fumadores */}
        <div className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl border ${
          !anuncio.fumadores ? 'bg-[#eef2f8] border-[#c7d4e8]' : 'bg-[#f4f5f7] border-gray-100'
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className={`w-5 h-5 ${!anuncio.fumadores ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>
            <line x1="2" y1="2" x2="22" y2="22"/><path d="M12 12H2v4h10.34M19.34 12H22v4M22 8c-1.11 0-2 .89-2 2v2M10 8a2 2 0 1 0-4 0v4"/>
          </svg>
          <span className={`text-[9px] font-semibold text-center leading-tight ${!anuncio.fumadores ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>{!anuncio.fumadores ? 'No' : 'Sí'}{'\n'}fuma</span>
        </div>

        {/* Sin fianza */}
        <div className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl border ${
          !anuncio.fianza ? 'bg-[#eef2f8] border-[#c7d4e8]' : 'bg-[#f4f5f7] border-gray-100'
        }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className={`w-5 h-5 ${!anuncio.fianza ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <span className={`text-[9px] font-semibold text-center leading-tight ${!anuncio.fianza ? 'text-[#1a3c5e]' : 'text-[#9ca3af]'}`}>{!anuncio.fianza ? 'Sin' : 'Con'}{'\n'}fianza</span>
        </div>
      </div>

      {/* ── Sobre la habitación ── */}
      <AccordionSection title="Sobre la habitación">
        <div className="grid grid-cols-2 divide-y divide-gray-50">
          {disponibleDesde && (
            <DetalleItem label="Disponible desde" value={disponibleDesde} />
          )}
          {anuncio.estancia_minima && (
            <DetalleItem label="Estancia mínima" value={`${anuncio.estancia_minima} mes${anuncio.estancia_minima > 1 ? 'es' : ''}`} />
          )}
          {anuncio.estancia_maxima && (
            <DetalleItem label="Estancia máxima" value={`${anuncio.estancia_maxima} mes${anuncio.estancia_maxima > 1 ? 'es' : ''}`} />
          )}
          {superficie && (
            <DetalleItem label="m² habitación" value={`${superficie} m²`} />
          )}
          {anuncio.amueblada !== null && anuncio.amueblada !== undefined && (
            <DetalleItem label="Amueblada" value={anuncio.amueblada ? 'Sí' : 'No'} />
          )}
          {anuncio.tipo_cama && (
            <DetalleItem label="Tipo de cama" value={anuncio.tipo_cama} />
          )}
          {anuncio.armario !== null && anuncio.armario !== undefined && (
            <DetalleItem label="Armario" value={anuncio.armario ? 'Sí' : 'No'} />
          )}
          {anuncio.escritorio !== null && anuncio.escritorio !== undefined && (
            <DetalleItem label="Escritorio" value={anuncio.escritorio ? 'Sí' : 'No'} />
          )}
          {anuncio.exterior !== null && anuncio.exterior !== undefined && (
            <DetalleItem label="Orientación" value={anuncio.exterior ? 'Exterior' : 'Interior'} />
          )}
          {anuncio.balcon_ventana !== null && anuncio.balcon_ventana !== undefined && (
            <DetalleItem label="Balcón o ventana" value={anuncio.balcon_ventana ? 'Sí' : 'No'} />
          )}
          <DetalleItem label="Baño" value={anuncio.bano_privado ? 'Privado' : 'Compartido'} />
        </div>
      </AccordionSection>

      {/* ── Sobre la vivienda ── */}
      <AccordionSection title="Sobre la vivienda">
        <div className="grid grid-cols-2 divide-y divide-gray-50">
          {anuncio.num_habitaciones && (
            <DetalleItem label="Habitaciones" value={String(anuncio.num_habitaciones)} />
          )}
          {anuncio.num_banos && (
            <DetalleItem label="Baños" value={String(anuncio.num_banos)} />
          )}
          {anuncio.num_personas && (
            <DetalleItem label="Personas" value={String(anuncio.num_personas)} />
          )}
          {anuncio.vive_propietario !== null && anuncio.vive_propietario !== undefined && (
            <DetalleItem label="Propietario en vivienda" value={anuncio.vive_propietario ? 'Sí' : 'No'} />
          )}
          {anuncio.ascensor !== null && anuncio.ascensor !== undefined && (
            <DetalleItem label="Ascensor" value={anuncio.ascensor ? 'Sí' : 'No'} />
          )}
          {anuncio.parking !== null && anuncio.parking !== undefined && (
            <DetalleItem label="Parking" value={anuncio.parking ? 'Sí' : 'No'} />
          )}
          {anuncio.terraza !== null && anuncio.terraza !== undefined && (
            <DetalleItem label="Terraza" value={anuncio.terraza ? 'Sí' : 'No'} />
          )}
          <DetalleItem label="Calefacción" value={calefaccionLabel} />
        </div>
      </AccordionSection>

      {/* ── Condiciones ── */}
      <AccordionSection title="Condiciones">
        <div className="grid grid-cols-2 divide-y divide-gray-50">

          {/* Gastos colapsable — ocupa columna completa */}
          <GastosItem
            gastos_incluidos={anuncio.gastos_incluidos}
            wifi={anuncio.wifi}
            calefaccion={anuncio.calefaccion}
          />

          <DetalleItem
            label="Fianza"
            value={anuncio.fianza
              ? (anuncio.importe_fianza ? `${anuncio.importe_fianza} €` : 'Sí')
              : 'Sin fianza'}
          />
          <DetalleItem
            label="Se aceptan parejas"
            value={anuncio.admite_pareja ? 'Sí' : 'No'}
          />
          <DetalleItem
            label="Se aceptan mascotas"
            value={anuncio.admite_mascotas ? 'Sí' : 'No'}
          />
          <DetalleItem
            label="Se permite fumar"
            value={anuncio.fumadores ? 'Sí' : 'No'}
          />
          <DetalleItem
            label="Empadronamiento"
            value={anuncio.empadronamiento ? 'Posible' : 'No disponible'}
          />
          {anuncio.preferencia_sexo && (
            <DetalleItem
              label="Perfil preferido"
              value={preferenciaSexoLabel}
            />
          )}
          {anuncio.idioma_vivienda && (
            <DetalleItem label="Idioma" value={anuncio.idioma_vivienda} />
          )}
          {anuncio.duracion_minima && (
            <DetalleItem label="Duración mínima" value={anuncio.duracion_minima} />
          )}
        </div>
      </AccordionSection>

    </div>
  )
}
