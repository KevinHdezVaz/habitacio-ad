export default function Spinner({
  size = 'sm',
  color = 'white',
}: {
  size?: 'xs' | 'sm' | 'md'
  color?: 'white' | 'teal' | 'blue'
}) {
  const sizes = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5' }
  const colors = {
    white: 'border-white/30 border-t-white',
    teal:  'border-[#0ea5a0]/30 border-t-[#0ea5a0]',
    blue:  'border-[#1a3c5e]/30 border-t-[#1a3c5e]',
  }

  return (
    <span
      className={`${sizes[size]} ${colors[color]} border-2 rounded-full animate-spin inline-block shrink-0`}
      aria-hidden="true"
    />
  )
}
