import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a3c5e] text-white mt-20 py-12">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-bold text-xl">Habitacio.ad</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            La plataforma definitiva para encontrar habitación en Andorra. Pensada para residentes, trabajadores temporeros y estudiantes.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Explora</h3>
          <nav className="flex flex-col gap-3 text-sm text-gray-400">
            <Link href="/habitaciones" className="hover:text-[#0ea5a0] transition-colors">Buscar habitación</Link>
            <Link href="/perfiles" className="hover:text-[#0ea5a0] transition-colors">Ver perfiles</Link>
            <Link href="/publicar" className="hover:text-[#0ea5a0] transition-colors">Publicar anuncio</Link>
            <Link href="/perfil" className="hover:text-[#0ea5a0] transition-colors">Mi perfil</Link>
          </nav>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Legal</h3>
          <nav className="flex flex-col gap-3 text-sm text-gray-400">
            <Link href="/aviso-legal" className="hover:text-[#0ea5a0] transition-colors">Aviso legal</Link>
            <Link href="/privacidad" className="hover:text-[#0ea5a0] transition-colors">Política de privacidad</Link>
            <Link href="/cookies" className="hover:text-[#0ea5a0] transition-colors">Política de cookies</Link>
            <Link href="/contacto" className="hover:text-[#0ea5a0] transition-colors">Contacto</Link>
          </nav>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 mt-12 pt-8 border-t border-gray-700 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Habitacio.ad. Todos los derechos reservados. Desarrollado en Andorra.</p>
      </div>
    </footer>
  )
}