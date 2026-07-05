export default function MistakeImpact({ data = [] }) {
  if (!data.length) return <div className="text-textMid text-sm py-4">No mistake data</div>

  const max = Math.max(...data.map(d => Math.abs(d.totalImpact || 0)), 1)

  return (
    <div className="space-y-3">
      {data.map(m => {
        const w = Math.abs(m.totalImpact || 0) / max * 100
        return (
          <div key={m.tag}>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{m.tag}</span>
                <span className="text-textMid text-[11px]">×{m.occurrences}</span>
              </div>
              <span className="font-mono font-bold text-sm text-red">
                −₹{Math.abs(m.totalImpact || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-red transition-all duration-500" style={{ width: `${w}%`, opacity: 0.8 }} />
            </div>
            <div className="text-[10px] text-textMid mt-0.5">
              Avg P&L per occurrence: <span className="text-red font-mono">−₹{Math.abs(m.avgPnl || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
