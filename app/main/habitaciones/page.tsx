'use client'

import TarjetaHabitacion from '@/components/habitaciones/TarjetaHabitacion'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const mockRooms = [
  {
    id: '1',
    titulo: 'Amplia habitación en el centro de Andorra la Vella',
    precio: 570,
    parroquia: 'Andorra la Vella',
    imagen: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'
  },
  {
    id: '2',
    titulo: 'Habitación luminosa con vistas a la montaña en Escaldes',
    precio: 680,
    parroquia: 'Escaldes',
    imagen: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600'
  },
  {
    id: '3',
    titulo: 'Piso compartido tranquilo en Encamp',
    precio: 490,
    parroquia: 'Encamp',
    imagen: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600'
  },
  {
    id: '4',
    titulo: 'Habitación económica para temporada de invierno',
    precio: 620,
    parroquia: 'Sant Julià',
    imagen: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600'
  },
  {
    id: '5',
    titulo: 'Atico estudio en Canillo ideal para esquiar',
    precio: 850,
    parroquia: 'Canillo',
    imagen: 'https://images.unsplash.com/photo-1512918766671-ed6a07be0618?w=600'
  },
  {
    id: '6',
    titulo: 'Habitación para pareja en la Massana',
    precio: 750,
    parroquia: 'La Massana',
    imagen: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600'
  },
]

export default function HabitacionesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1a3c5e]">Anuncios disponibles</h1>
        <p className="text-[#6b7280] mt-2">Encuentra tu próximo hogar entre {mockRooms.length} habitaciones en Andorra.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-grow w-full">
          <Input
            label="Buscar por zona o palabra clave"
            placeholder="Ej: Escaldes, céntrico, balcón..."
          />
        </div>
        <div className="w-full md:w-48">
          <label className="text-sm font-bold text-[#1a3c5e] ml-1 block mb-1.5">Parroquia</label>
          <select className="w-full px-4 py-3 rounded-xl border-transparent bg-[#f4f5f7] text-sm focus:bg-white focus:border-[#1a3c5e] outline-none transition-all">
            <option>Todas</option>
            <option>Andorra la Vella</option>
            <option>Escaldes-Engordany</option>
            <option>Encamp</option>
            <option>Canillo</option>
            <option>La Massana</option>
            <option>Ordino</option>
            <option>Sant Julià de Lòria</option>
          </select>
        </div>
        <Button variant="secondary" className="w-full md:w-auto px-10">Filtrar</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockRooms.map((room) => (
          <TarjetaHabitacion key={room.id} anuncio={room} />
        ))}
      </div>
    </div>
  )
}
