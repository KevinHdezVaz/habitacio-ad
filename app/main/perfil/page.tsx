'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function PerfilPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a3c5e]">Mi Perfil</h1>
          <p className="text-[#6b7280] mt-1">Gestiona tu información y preferencias de búsqueda.</p>
        </div>
        <Button variant="outline" size="sm">Cerrar sesión</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Card className="p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-[#1a3c5e]">Marc Ferrer</p>
              <p className="text-xs text-[#6b7280]">miembro desde Marzo 2026</p>
            </div>
            <Button size="sm" variant="ghost" className="text-xs">Cambiar foto</Button>
          </Card>
        </div>

        <div className="md:col-span-3 flex flex-col gap-6">
          <Card className="p-6 flex flex-col gap-6">
            <h2 className="font-bold text-[#1a3c5e] text-lg border-b border-gray-100 pb-3">Información personal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" defaultValue="Marc" />
              <Input label="Apellidos" defaultValue="Ferrer" />
            </div>
            
            <Input label="Email" defaultValue="marc.ferrer@email.com" readOnly className="opacity-70" />
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">Sobre mí</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border-transparent bg-[#f4f5f7] text-sm focus:bg-white focus:border-[#1a3c5e] outline-none transition-all min-h-[100px]"
                defaultValue="Trabajo en el sector bancario y busco una habitación tranquila para larga temporada en Andorra la Vella o Escaldes."
              ></textarea>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button>Guardar cambios</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-bold text-[#1a3c5e] text-lg border-b border-gray-100 pb-3 mb-6">Mis anuncios</h2>
            <div className="text-center py-10 flex flex-col items-center gap-3">
              <span className="text-4xl">📭</span>
              <p className="text-[#6b7280] text-sm">Aún no has publicado ningún anuncio.</p>
              <Button href="/publicar" variant="secondary" size="sm" className="mt-2">Publicar mi primer anuncio</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
