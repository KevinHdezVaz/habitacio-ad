'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Anuncio } from '@/app/types'
import TarjetaHabitacion from '@/app/components/habitaciones/TarjetaHabitacion'

const PARROQUIAS = [
    'Andorra la Vella',
    'Escaldes-Engordany',
    'Encamp',
    'Sant Julià de Lòria',
    'La Massana',
    'Ordino',
    'Canillo',
]

export default function Habitaciones() {
    const [anuncios, setAnuncios] = useState<Anuncio[]>([])
    const [cargando, setCargando] = useState(true)
    const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

    const [filtros, setFiltros] = useState({
        parroquia: '',
        precioMin: '',
        precioMax: '',
        tipoEstancia: '',
        fianza: '',
        gastosIncluidos: '',
        admitePareja: '',
        admiteMascotas: '',
        fumadores: '',
        orden: 'recientes',
    })

    useEffect(() => {
        cargarAnuncios()
    }, [filtros])

    async function cargarAnuncios() {
        setCargando(true)
        let query = supabase
            .from('anuncios')
            .select('*, imagenes_anuncio(*)')
            .eq('estado', 'activo')

        if (filtros.parroquia) query = query.eq('parroquia', filtros.parroquia)
        if (filtros.precioMin) query = query.gte('precio', filtros.precioMin)
        if (filtros.precioMax) query = query.lte('precio', filtros.precioMax)
        if (filtros.tipoEstancia) query = query.eq('tipo_estancia', filtros.tipoEstancia)
        if (filtros.fianza) query = query.eq('fianza', filtros.fianza === 'si')
        if (filtros.gastosIncluidos) query = query.eq('gastos_incluidos', filtros.gastosIncluidos === 'si')
        if (filtros.admitePareja) query = query.eq('admite_pareja', filtros.admitePareja === 'si')
        if (filtros.admiteMascotas) query = query.eq('admite_mascotas', filtros.admiteMascotas === 'si')
        if (filtros.fumadores) query = query.eq('fumadores', filtros.fumadores === 'si')

        if (filtros.orden === 'precio_asc') query = query.order('precio', { ascending: true })
        else if (filtros.orden === 'precio_desc') query = query.order('precio', { ascending: false })
        else query = query.order('created_at', { ascending: false })

        const { data } = await query
        setAnuncios(data || [])
        setCargando(false)
    }

    function actualizarFiltro(key: string, valor: string) {
        setFiltros(prev => ({ ...prev, [key]: valor }))
    }

    function limpiarFiltros() {
        setFiltros({
            parroquia: '',
            precioMin: '',
            precioMax: '',
            tipoEstancia: '',
            fianza: '',
            gastosIncluidos: '',
            admitePareja: '',
            admiteMascotas: '',
            fumadores: '',
            orden: 'recientes',
        })
    }

    return (
        <div className="flex flex-col gap-4">

            {/* CABECERA */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a3c5e]">Habitaciones</h1>
                    <p className="text-[#6b7280] text-sm">{anuncios.length} anuncios disponibles</p>
                </div>
                <button
                    onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                    className="flex items-center gap-2 bg-white border border-[#e5e7eb] px-4 py-2 rounded-xl text-sm font-medium text-[#1a3c5e] shadow-sm"
                >
                    🔧 Filtros
                </button>
            </div>

            {/* ORDENACIÓN */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                    { label: 'Más recientes', valor: 'recientes' },
                    { label: 'Precio ↑', valor: 'precio_asc' },
                    { label: 'Precio ↓', valor: 'precio_desc' },
                ].map((op) => (
                    <button
                        key={op.valor}
                        onClick={() => actualizarFiltro('orden', op.valor)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filtros.orden === op.valor
                                ? 'bg-[#1a3c5e] text-white'
                                : 'bg-white text-[#6b7280] border border-[#e5e7eb]'
                            }`}
                    >
                        {op.label}
                    </button>
                ))}
            </div>

            {/* PANEL DE FILTROS */}
            {filtrosAbiertos && (
                <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-[#1a3c5e]">Filtros</p>
                        <button onClick={limpiarFiltros} className="text-[#0ea5a0] text-sm font-medium">
                            Limpiar
                        </button>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-[#6b7280] mb-1 block">Parroquia</label>
                        <select
                            value={filtros.parroquia}
                            onChange={(e) => actualizarFiltro('parroquia', e.target.value)}
                            className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 text-sm text-[#1a3c5e]"
                        >
                            <option value="">Todas</option>
                            {PARROQUIAS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-[#6b7280] mb-1 block">Precio mín (€)</label>
                            <input
                                type="number"
                                value={filtros.precioMin}
                                onChange={(e) => actualizarFiltro('precioMin', e.target.value)}
                                placeholder="0"
                                className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 text-sm text-[#1a3c5e]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-[#6b7280] mb-1 block">Precio máx (€)</label>
                            <input
                                type="number"
                                value={filtros.precioMax}
                                onChange={(e) => actualizarFiltro('precioMax', e.target.value)}
                                placeholder="2000"
                                className="w-full border border-[#e5e7eb] rounded-xl px-3 py-2 text-sm text-[#1a3c5e]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-[#6b7280] mb-1 block">Tipo de estancia</label>
                        <div className="flex gap-2">
                            {[
                                { label: 'Todos', valor: '' },
                                { label: 'Anual', valor: 'anual' },
                                { label: 'Temporero', valor: 'temporero' },
                                { label: 'Ambos', valor: 'ambos' },
                            ].map((op) => (
                                <button
                                    key={op.valor}
                                    onClick={() => actualizarFiltro('tipoEstancia', op.valor)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${filtros.tipoEstancia === op.valor
                                            ? 'bg-[#1a3c5e] text-white'
                                            : 'bg-[#f4f5f7] text-[#6b7280]'
                                        }`}
                                >
                                    {op.label}
                                </button>