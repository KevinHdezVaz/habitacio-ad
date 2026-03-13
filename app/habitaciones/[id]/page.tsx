'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useParams } from 'next/navigation'

export default function HabitacionDetallePage() {
  const params = useParams()
  const id = params.id

  // En una app real, buscaríamos los datos por ID
  const room = {
    titulo: 'Amplia habitación en el centro de Andorra la Vella',
    precio: 570,
    gastos: 'Gastos incluidos',
    parroquia: 'Andorra la Vella',
    descripcion: 'Se alquila habitación muy luminosa en piso compartido de 3 habitaciones. El piso está totalmente reformado y equipado. Buscamos a una persona tranquila, trabajadora y limpia. No se aceptan mascotas ni fumadores.',
    caracteristicas: ['Cama doble', 'Armario empotrado', 'Escritorio', 'Wifi alta velocidad', 'Calefacción central'],
    imagenes: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400',
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400'
    ],
    propietario: {
      nombre: 'Marc Ferrer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gallery */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="aspect-video rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <img src={room.imagenes[0]} alt="Principal" className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100">
              <img src={room.imagenes[1]} alt="Secundaria" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100">
              <img src={room.imagenes[2]} alt="Terciaria" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Sidebar / Info */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 flex flex-col gap-6 sticky top-24">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-3xl font-bold text-[#1a3c5e]">{room.precio} €<span className="text-sm font-normal text-[#6b7280]">/mes</span></p>
                <p className="text-xs font-bold text-[#0ea5a0] mt-1 uppercase tracking-wider">{room.gastos}</p>
              </div>
              <button className="text-2xl">❤️</button>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h1 className="font-bold text-[#1a3c5e] text-xl leading-tight">{room.titulo}</h1>
              <p className="text-sm text-[#6b7280] mt-2 flex items-center gap-1">
                📍 {room.parroquia}, Andorra
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <Button variant="primary" className="w-full">Contactar por Chat</Button>
              <Button variant="outline" className="w-full">Llamar al anunciante</Button>
            </div>

            <div className="border-t border-gray-100 pt-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img src={room.propietario.avatar} alt="Propietario" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-[#6b7280]">Anunciante</p>
                <p className="text-sm font-bold text-[#1a3c5e]">{room.propietario.nombre}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          <section>
            <h2 className="text-xl font-bold text-[#1a3c5e] mb-4">Descripción</h2>
            <p className="text-[#6b7280] leading-relaxed text-base">
              {room.descripcion}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a3c5e] mb-4">¿Qué ofrece este alojamiento?</h2>
            <div className="grid grid-cols-2 gap-4">
              {room.caracteristicas.map((item) => (
                <div key={item} className="flex items-center gap-3 text-[#1a3c5e] text-sm">
                  <span className="text-[#0ea5a0]">✨</span>
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
