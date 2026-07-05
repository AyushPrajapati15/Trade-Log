import { useTradeStore } from '../../store/tradeStore'

const SEGMENTS = ['', 'EQUITY', 'FO_OPTIONS', 'FO_FUTURES', 'CRYPTO']
const SIDES = ['', 'LONG', 'SHORT']

export default function TradeFilters({ onFilter }) {
  const { filters, setFilters } = useTradeStore()

  const update = (key, val) => {
    setFilters({ [key]: val })
    onFilter?.()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Segment */}
      <div className="flex gap-1">
        {SEGMENTS.map(s => (
          <button key={s} onClick={() => update('segment', s)}
            className={`filter-pill ${filters.segment === s ? 'active' : ''}`}>
            {s || 'All Segments'}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-border" />

      {/* Side */}
      <div className="flex gap-1">
        {SIDES.map(s => (
          <button key={s} onClick={() => update('side', s)}
            className={`filter-pill ${filters.side === s ? 'active' : ''}`}>
            {s || 'Both'}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-border hidden md:block" />

      {/* Date range */}
      <div className="hidden md:flex items-center gap-1.5">
        <input type="date" className="input-base w-auto text-xs py-1.5" value={filters.from}
          onChange={e => update('from', e.target.value)} />
        <span className="text-textMid text-xs">to</span>
        <input type="date" className="input-base w-auto text-xs py-1.5" value={filters.to}
          onChange={e => update('to', e.target.value)} />
      </div>

      {/* Clear */}
      {(filters.segment || filters.side || filters.from || filters.to) && (
        <button onClick={() => { setFilters({ segment: '', side: '', from: '', to: '' }); onFilter?.() }}
          className="text-xs text-red hover:underline">
          Clear filters
        </button>
      )}
    </div>
  )
}
