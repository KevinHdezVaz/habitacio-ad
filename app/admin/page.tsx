'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function AdminPage() {
  const stats = [
    { label: 'Total Habitaciones', value: '124', icon: '🏠' },
    { label: 'Usuarios Activos', value: '852', icon: '👥' },
    { label: 'Chats Hoy', value: '45', icon: '💬' },
    { label: 'Reportes', value: '2', icon: '⚠️' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a3c5e]">Panel de Administración</h1>
          <p className="text-[#6b7280] mt-1">Resumen del estado de la plataforma.</p>
        </div>
        <Button variant="secondary" size="sm">Exportar Datos</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f4f5f7] flex items-center justify-center text-2xl">
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-[#6b7280] font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-[#1a3c5e]">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-bold text-[#1a3c5e] text-lg border-b border-gray-100 pb-3 mb-6">Actividad Reciente</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[#6b7280] font-medium border-b border-gray-50">
              <tr>
                <th className="pb-3 px-2">Usuario</th>
                <th className="pb-3 px-2">Acción</th>
                <th className="pb-3 px-2">Fecha</th>
                <th className="pb-3 px-2 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2 font-medium text-[#1a3c5e]">Usuario {i}</td>
                  <td className="py-4 px-2 text-[#6b7280]">Publicó nueva habitación</td>
                  <td className="py-4 px-2 text-[#6b7280]">Hace 2 horas</td>
                  <td className="py-4 px-2 text-right">
                    <span className="bg-[#e6f7f7] text-[#0ea5a0] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Completado</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
