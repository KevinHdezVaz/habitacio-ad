import Link from 'next/link'
import Spinner from './Spinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  loading?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary:   'bg-[#1a3c5e] text-white hover:bg-[#152e4a] shadow-sm',
    secondary: 'bg-[#0ea5a0] text-white hover:bg-[#0c8e8a] shadow-sm',
    outline:   'border-2 border-[#1a3c5e] text-[#1a3c5e] hover:bg-[#1a3c5e] hover:text-white',
    ghost:     'text-[#1a3c5e] hover:bg-[#f4f5f7]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const spinnerColor = variant === 'outline' || variant === 'ghost' ? 'blue' : 'white'
  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    )
  }

  return (
    <button className={combinedClassName} disabled={disabled || loading} {...props}>
      {loading && <Spinner size="sm" color={spinnerColor} />}
      {children}
    </button>
  )
}
