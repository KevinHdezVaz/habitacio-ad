import Link from 'next/link'

export default function EnviadoPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[#e6f7f7] flex items-center justify-center text-4xl">
          ✅
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a3c5e] mb-2">¡Anuncio enviado!</h1>
          <p className="text-[#6b7280] leading-relaxed">
            Tu anuncio ha sido enviado para revisión. Lo publicaremos en las próximas horas una vez verificado.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/habitaciones"
            className="flex-1 bg-[#f4f5f7] text-[#1a3c5e] font-semibold py-3 rounded-2xl text-center text-sm hover:bg-gray-200 transition-colors"
          >
            Ver habitaciones
          </Link>
          <Link
            href="/perfil"
            className="flex-1 bg-[#1a3c5e] text-white font-semibold py-3 rounded-2xl text-center text-sm hover:bg-[#163354] transition-colors"
          >
            Mi perfil
          </Link>
        </div>
      </div>
    </div>
  )
}
