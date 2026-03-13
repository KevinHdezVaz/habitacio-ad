'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Crea tu cuenta</h1>
        <p className="text-[#6b7280] text-sm mt-2">Únete a la comunidad de Habitacio.ad</p>
      </div>

      <form className="flex flex-col gap-5">
        <Input 
          label="Nombre completo" 
          placeholder="Ej: Marc Ferrer" 
          type="text" 
          required 
        />
        <Input 
          label="Email" 
          placeholder="tu@email.com" 
          type="email" 
          required 
        />
        <Input 
          label="Contraseña" 
          placeholder="Mínimo 8 caracteres" 
          type="password" 
          required 
        />
        
        <div className="flex items-start gap-2 mt-2">
          <input type="checkbox" id="terms" className="mt-1" required />
          <label htmlFor="terms" className="text-xs text-[#6b7280] leading-normal">
            Acepto los <Link href="/terminos" className="text-[#0ea5a0] font-semibold">Términos y Condiciones</Link> y la <Link href="/privacidad" className="text-[#0ea5a0] font-semibold">Política de Privacidad</Link>.
          </label>
        </div>

        <Button type="submit" className="w-full mt-2">
          Crear cuenta
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-[#6b7280]">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-bold text-[#1a3c5e] hover:text-[#0ea5a0]">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
