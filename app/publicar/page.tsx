'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useState } from 'react'

export default function PublicarPage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold text-[#1a3c5e]">Publica tu anuncio</h1>
        <p className="text-[#6b7280] mt-2">Completa los detalles de tu habitación para encontrar al compañero ideal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="p-6 flex flex-col gap-6">
            <h2 className="font-bold text-[#1a3c5e] text-lg border-b border-gray-100 pb-3">Información básica</h2>
            
            <Input 
              label="Título del anuncio" 
              placeholder="Ej: Habitación luminosa en el centro con balcón" 
              required 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Precio mensual (€)" 
                placeholder="Ej: 500" 
                type="number"
                required 
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-[#1a3c5e] ml-1">Parroquia</label>
                <select className="w-full px-4 py-3 rounded-xl border-transparent bg-[#f4f5f7] text-sm focus:bg-white focus:border-[#1a3c5e] outline-none transition-all">
                  <option disabled selected>Selecciona una...</option>
                  <option>Andorra la Vella</option>
                  <option>Escaldes-Engordany</option>
                  <option>Encamp</option>
                  <option>Canillo</option>
                  <option>La Massana</option>
                  <option>Ordino</option>
                  <option>Sant Julià de Lòria</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-bold text-[#1a3c5e] ml-1">Descripción</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border-transparent bg-[#f4f5f7] text-sm focus:bg-white focus:border-[#1a3c5e] outline-none transition-all min-h-[150px]"
                placeholder="Cuéntanos sobre la habitación, el piso y el perfil de compañero que buscas..."
              ></textarea>
            </div>
          </Card>

          <Card className="p-6 flex flex-col gap-6">
            <h2 className="font-bold text-[#1a3c5e] text-lg border-b border-gray-100 pb-3">Fotos de la habitación</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-[#0ea5a0] transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-[#f4f5f7] flex items-center justify-center text-2xl group-hover:bg-[#e6f7f7] transition-colors">
                📸
              </div>
              <div className="text-center">
                <p className="font-bold text-[#1a3c5e] text-sm">Clica para subir imágenes</p>
                <p className="text-[#6b7280] text-xs mt-1">Sube al menos 3 fotos para mayor visibilidad</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost">Guardar borrador</Button>
            <Button variant="primary" className="px-12">Publicar ahora</Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-5 bg-[#e8f4fd] border-none">
            <h3 className="font-bold text-[#1a3c5e] text-sm mb-3">Consejos para tu anuncio</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex gap-2 text-xs text-[#1a3c5e]">
                <span>✅</span>
                <p>Usa fotos con buena iluminación.</p>
              </li>
              <li className="flex gap-2 text-xs text-[#1a3c5e]">
                <span>✅</span>
                <p>Sé honesto con las normas de la casa.</p>
              </li>
              <li className="flex gap-2 text-xs text-[#1a3c5e]">
                <span>✅</span>
                <p>Describe bien la zona y servicios cercanos.</p>
              </li>
            </ul>
          </Card>
          
          <Card className="p-5">
            <h3 className="font-bold text-[#1a3c5e] text-sm mb-2">Ayuda</h3>
            <p className="text-xs text-[#6b7280] leading-relaxed">
              ¿Tienes dudas sobre cómo publicar? Contáctanos a través de nuestro centro de soporte.
            </p>
            <Button variant="outline" size="sm" className="w-full mt-4">Hablar con soporte</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
