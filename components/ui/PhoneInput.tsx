'use client'

import { useState } from 'react'

const COUNTRIES = [
  { code: '+376', flag: '🇦🇩', name: 'Andorra',        short: 'AD' },
  { code: '+34',  flag: '🇪🇸', name: 'España',         short: 'ES' },
  { code: '+33',  flag: '🇫🇷', name: 'Francia',        short: 'FR' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal',       short: 'PT' },
  { code: '+44',  flag: '🇬🇧', name: 'Reino Unido',    short: 'GB' },
  { code: '+49',  flag: '🇩🇪', name: 'Alemania',       short: 'DE' },
  { code: '+39',  flag: '🇮🇹', name: 'Italia',         short: 'IT' },
  { code: '+31',  flag: '🇳🇱', name: 'Países Bajos',   short: 'NL' },
  { code: '+40',  flag: '🇷🇴', name: 'Rumanía',        short: 'RO' },
  { code: '+48',  flag: '🇵🇱', name: 'Polonia',        short: 'PL' },
  { code: '+212', flag: '🇲🇦', name: 'Marruecos',      short: 'MA' },
  { code: '+55',  flag: '🇧🇷', name: 'Brasil',         short: 'BR' },
  { code: '+54',  flag: '🇦🇷', name: 'Argentina',      short: 'AR' },
  { code: '+57',  flag: '🇨🇴', name: 'Colombia',       short: 'CO' },
  { code: '+56',  flag: '🇨🇱', name: 'Chile',          short: 'CL' },
  { code: '+52',  flag: '🇲🇽', name: 'México',         short: 'MX' },
  { code: '+1',   flag: '🇺🇸', name: 'EE.UU.',         short: 'US' },
  { code: '+1',   flag: '🇨🇦', name: 'Canadá',         short: 'CA' },
]

function parseInitial(value: string) {
  // Try to detect existing country code in saved value
  for (const c of COUNTRIES) {
    if (value.startsWith(c.code + ' ') || value.startsWith(c.code)) {
      return {
        countryCode: c.code,
        number: value.slice(c.code.length).trim(),
      }
    }
  }
  return { countryCode: '+376', number: value }
}

interface PhoneInputProps {
  label?: string
  name: string
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => void
}

export default function PhoneInput({
  label,
  name,
  defaultValue = '',
  placeholder = '600 000',
  onChange,
}: PhoneInputProps) {
  const parsed = parseInitial(defaultValue)
  const [countryCode, setCountryCode] = useState(parsed.countryCode)
  const [number, setNumber] = useState(parsed.number)
  const [open, setOpen] = useState(false)

  const selected = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0]
  const combined = number.trim() ? `${countryCode} ${number.trim()}` : ''

  function pick(code: string) {
    setCountryCode(code)
    setOpen(false)
    const val = number.trim() ? `${code} ${number.trim()}` : ''
    onChange?.(val)
  }

  function handleNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setNumber(val)
    const full = val.trim() ? `${countryCode} ${val.trim()}` : ''
    onChange?.(full)
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-bold text-[#1a3c5e] ml-1">{label}</label>
      )}

      {/* Hidden input with combined value for form submission */}
      <input type="hidden" name={name} value={combined} />

      <div className="flex gap-2 relative">
        {/* Country selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 h-full px-3 py-3 rounded-xl bg-[#f4f5f7] text-sm font-medium text-[#1a3c5e] hover:bg-[#e8edf2] transition-colors whitespace-nowrap min-w-[88px]"
          >
            <span className="text-base leading-none">{selected.flag}</span>
            <span className="tabular-nums">{selected.code}</span>
            <svg
              className={`w-3 h-3 text-[#6b7280] transition-transform ${open ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden w-52 max-h-64 overflow-y-auto">
                {COUNTRIES.map((c, i) => (
                  <button
                    key={`${c.code}-${c.short}`}
                    type="button"
                    onClick={() => pick(c.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[#f4f5f7] ${
                      i === 0 ? '' : 'border-t border-gray-50'
                    } ${c.code === countryCode && c.short === selected.short ? 'bg-[#f4f5f7] font-semibold text-[#1a3c5e]' : 'text-[#374151]'}`}
                  >
                    <span className="text-base leading-none w-5 text-center">{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-[#9ca3af] tabular-nums text-xs">{c.code}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Number input */}
        <input
          type="tel"
          value={number}
          onChange={handleNumber}
          placeholder={placeholder}
          autoComplete="tel-national"
          className="flex-1 px-4 py-3 rounded-xl border-2 border-transparent bg-[#f4f5f7] text-sm outline-none focus:border-[#1a3c5e] focus:bg-white focus:shadow-sm transition-all"
        />
      </div>
    </div>
  )
}
