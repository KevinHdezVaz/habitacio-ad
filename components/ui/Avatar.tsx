// Componente Avatar reutilizable — muestra foto si existe, iniciales si no
interface AvatarProps {
  avatarUrl?: string | null
  nombre: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'full' | '2xl'
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-7  h-7  text-[10px]',
  sm: 'w-9  h-9  text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl',
}

export default function Avatar({
  avatarUrl,
  nombre,
  size = 'md',
  rounded = 'full',
  className = '',
}: AvatarProps) {
  const iniciales = nombre
    ? nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  const sizeClass   = SIZE_CLASSES[size]
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl'

  if (avatarUrl) {
    return (
      <div className={`${sizeClass} ${roundedClass} overflow-hidden flex-shrink-0 ${className}`}>
        <img src={avatarUrl} alt={nombre} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={`${sizeClass} ${roundedClass} bg-gradient-to-br from-[#1a3c5e] to-[#2d5a8e] flex items-center justify-center text-white font-bold select-none flex-shrink-0 ${className}`}
    >
      {iniciales}
    </div>
  )
}
