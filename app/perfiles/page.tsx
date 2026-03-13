'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'

const mockProfiles = [
  {
    id: '1',
    nombre: 'Marc Ferrer',
    info: 'Busco habitación por Andorra la Vella o Escaldes. Trabajo en banca.',
    interes: 'Larga temporada',
    presupuesto: 'Hasta 700€',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
  },
  {
    id: '2',
    nombre: 'Laura Sanz',
    info: 'Temporera de esquí, busco piso compartido cerca de pistas o con buena conexión.',
    interes: 'Temporada invierno',
    presupuesto: 'Hasta 600€',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
  },
  {
    id: '3',
    nombre: 'David Pou',
    info: 'Estudiante de máster, chico tranquilo y ordenado. Busco habitación en Sant Julià.',
    interes: 'Curso escolar',
    presupuesto: 'Hasta 450€',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
  },
  {
    id: '4',
    nombre: 'Elena Ruiz',
    info: 'Trabajo remoto, busco un ambiente tranquilo y con buen internet.',
    interes: 'Larga temporada',
    presupuesto: 'Hasta 800€',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
  }
]

export default function PerfilesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1a3c5e]">Personas buscando habitación</h1>
        <p className="text-[#6b7280] mt-2">Conoce a posibles compañeros de piso y contacta con ellos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockProfiles.map((p) => (
          <Card key={p.id} className="p-6 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-4 ring-[#e8f4fd]">
              <img src={p.avatar} alt={p.nombre} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-[#1a3c5e] text-lg">{p.nombre}</h3>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="text-[10px] font-bold bg-[#e6f7f7] text-[#0ea5a0] px-2 py-0.5 rounded-full uppercase">{p.interes}</span>
                <span className="text-[10px] font-bold bg-[#f4f5f7] text-[#1a3c5e] px-2 py-0.5 rounded-full uppercase">{p.presupuesto}</span>
              </div>
            </div>
            <p className="text-xs text-[#6b7280] line-clamp-3 leading-relaxed">
              "{p.info}"
            </p>
            <Button size="sm" variant="outline" className="w-full mt-2">Ver perfil completo</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
