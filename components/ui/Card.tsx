interface CardProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export default function Card({ className = '', children, onClick }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${className} ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
