export default function MantenimientoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
      <div className="max-w-md w-full mx-4 text-center flex flex-col items-center gap-6">

        <div className="w-20 h-20 rounded-2xl bg-[#1a3c5e] flex items-center justify-center shadow-lg">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 30V22C8 14.268 14.268 8 22 8h0c7.732 0 14 6.268 14 14v8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <rect x="4" y="28" width="8" height="6" rx="2" fill="white"/>
            <rect x="28" y="28" width="8" height="6" rx="2" fill="white"/>
          </svg>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-[#1a3c5e]">
            Habitacio.ad — Próximamente
          </h1>
          <p className="text-[#374151] text-sm leading-relaxed">
            Estamos ultimando los últimos detalles para ofrecerte la mejor plataforma de habitaciones en alquiler de Andorra. ¡Volvemos muy pronto!
          </p>
          <p className="text-[#9ca3af] text-xs">
            Habitació.ad — Aviat disponible
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#374151]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5A6.5 6.5 0 1 0 8 14.5A6.5 6.5 0 0 0 8 1.5ZM8 4.5v4l2.5 2.5" stroke="#1a3c5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Contacto: <a href="mailto:hola@habitacio.ad" className="text-[#1a3c5e] underline">hola@habitacio.ad</a>
        </div>

      </div>
    </div>
  )
}
