export default function SetupChart({ data = [] }) {
  if (!data.length) return <div className="text-textMid text-sm py-4">No setup data</div>

  const max = Math.max(...data.map(d => Math.abs(d.netPnl || 0)), 1)

  return (
    <div className="space-y-3">
      {data.map(s => {
        const pos = s.netPnl >= 0
        const w = Math.abs(s.netPnl || 0) / max * 100
        return (
          <div key={s.setup}>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{s.setup}</span>
                <span className="text-textMid text-[11px]">{s.trades} trades · {s.winRate}% win</span>
              </div>
              <span className={`font-mono font-bold text-sm ${pos ? 'text-accent' : 'text-red'}`}>
                {pos ? '+' : '−'}₹{Math.abs(s.netPnl || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pos ? 'bg-accent' : 'bg-red'}`}
                style={{ width: `${w}%`, opacity: 0.85 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
