import Link from 'next/link'

export default function PerfilPublicadoPage() {
  return (
    <div className="max-w-md mx-auto flex flex-col items-center text-center gap-6 pt-8">
      {/* Icono */}
      <div className="w-20 h-20 rounded-full bg-[#e6f7f7] flex items-center justify-center text-4xl">
        🎉
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#1a3c5e]">¡Perfil publicado!</h1>
        <p className="text-[#6b7280] text-sm leading-relaxed">
          Ahora pueden encontrarte personas con habitación disponible.
          Recibirás sus mensajes en tu bandeja de entrada.
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-3 w-full">
        <Link
          href="/perfiles"
          className="w-full py-3 rounded-2xl bg-[#1a3c5e] text-white font-semibold text-sm text-center hover:bg-[#0ea5a0] transition-colors"
        >
          Ver perfiles publicados
        </Link>


        {/* Destacar perfil — preparado para Fase 2 
        <button
          disabled
          className="w-full py-3 rounded-2xl border-2 border-dashed border-[#0ea5a0]/40 text-[#0ea5a0] font-semibold text-sm flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
        >
          ⭐ Destacar mi perfil
          <span className="text-[10px] bg-[#0ea5a0] text-white px-2 py-0.5 rounded-full font-bold uppercase">
            Próximamente
          </span>
        </button>
        */}


        <Link
          href="/"
          className="text-sm text-[#9ca3af] hover:text-[#6b7280] transition-colors"
        >
          Volver al inicio
        </Link>
      </div>

      {/* Info extra */}
      <div className="bg-[#f4f5f7] rounded-2xl p-4 text-left w-full">
        <p className="text-xs font-semibold text-[#374151] mb-2">¿Qué pasa ahora?</p>
        <ul className="flex flex-col gap-1.5">
          {[
            'Tu perfil ya es visible para propietarios',
            'Si alguien te quiere contactar, te llegará un mensaje',
            'Puedes editar o desactivar tu perfil en cualquier momento',
          ].map((item) => (
            <li key={item} className="text-xs text-[#6b7280] flex items-start gap-2">
              <span className="text-[#0ea5a0] mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
