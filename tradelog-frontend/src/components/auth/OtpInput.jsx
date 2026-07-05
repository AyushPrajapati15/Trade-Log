import { useRef } from 'react'

export default function OtpInput({ value, onChange, label }) {
  const inputs = useRef([])

  const handleChange = (i, val) => {
    const digits = value.split('')
    digits[i] = val.slice(-1)
    const next = digits.join('')
    onChange(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(text.padEnd(6, ''))
    inputs.current[Math.min(text.length, 5)]?.focus()
  }

  return (
    <div>
      {label && <div className="section-label mb-2">{label}</div>}
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={el => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="w-full aspect-square text-center font-mono text-lg font-bold bg-surface2 border border-border rounded-lg
                       focus:border-accent focus:outline-none transition-colors text-white"
          />
        ))}
      </div>
    </div>
  )
}
