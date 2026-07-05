import { format, getDaysInMonth, startOfMonth, getDay, subMonths } from 'date-fns'

export default function CalendarStrip({ data = {}, month }) {
  const date = month ? new Date(month + '-01') : new Date()
  const year = date.getFullYear()
  const mo = date.getMonth()
  const days = getDaysInMonth(date)
  const startDay = getDay(startOfMonth(date))
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const getKey = (d) =>
    `${year}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(d => (
          <div key={d} className="text-center text-[9px] font-bold text-textMid">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const d = i + 1
          const key = getKey(d)
          const pnl = data[key]
          const hasData = pnl !== undefined
          const isPos = hasData && pnl > 0
          const isNeg = hasData && pnl < 0
          return (
            <div
              key={d}
              title={hasData ? `${key}: ${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toLocaleString('en-IN')}` : key}
              className={`aspect-square rounded flex items-center justify-center text-[9px] font-bold transition-all cursor-default
                ${isPos ? 'bg-accent/15 text-accent border border-accent/20' :
                  isNeg ? 'bg-red/15 text-red border border-red/20' :
                  hasData ? 'bg-border text-textMid' :
                  'text-textDim'}`}
            >
              {d}
            </div>
          )
        })}
      </div>
      <div className="flex gap-3 mt-3">
        {[['bg-accent/15 border border-accent/20', 'Profit'], ['bg-red/15 border border-red/20', 'Loss'], ['bg-border', 'No trade']].map(([cls, lbl]) => (
          <div key={lbl} className="flex items-center gap-1.5 text-[10px] text-textMid">
            <div className={`w-3 h-3 rounded ${cls}`} />{lbl}
          </div>
        ))}
      </div>
    </div>
  )
}
