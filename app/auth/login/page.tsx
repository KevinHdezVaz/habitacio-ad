'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Bienvenido de nuevo</h1>
        <p className="text-[#6b7280] text-sm mt-2">Introduce tus datos para acceder a tu cuenta.</p>
      </div>

      <form className="flex flex-col gap-5">
        <Input 
          label="Email" 
          placeholder="tu@email.com" 
          type="email" 
          required 
        />
        <Input 
          label="Contraseña" 
          placeholder="••••••••" 
          type="password" 
          required 
        />
        
        <div className="flex justify-end mt-[-10px]">
          <Link href="/recuperar" className="text-xs font-semibold text-[#0ea5a0] hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" className="w-full mt-2">
          Iniciar sesión
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-[#6b7280]">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-bold text-[#1a3c5e] hover:text-[#0ea5a0]">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
