interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-bold text-[#1a3c5e] ml-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-sm transition-all outline-none
          ${error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-transparent focus:border-[#1a3c5e] bg-[#f4f5f7] focus:bg-white focus:shadow-sm'
          } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  )
}
