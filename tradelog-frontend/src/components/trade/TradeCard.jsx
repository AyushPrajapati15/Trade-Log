import MistakeTags from '../dashboard/MistakeTags'

export default function TradeCard({ trade: t, onDelete }) {
  const isProfit = t.netPnl >= 0
  return (
    <div className="card-sm border-l-2 mb-3 animate-fade-up" style={{ borderLeftColor: isProfit ? '#05E8B4' : '#FF3D6B' }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold text-sm">{t.symbol}</div>
          <div className="text-[11px] text-textMid mt-0.5">{t.tradeDate} · {t.segment}</div>
        </div>
        <div className="text-right">
          <div className={`font-mono font-bold text-base ${isProfit ? 'text-accent' : 'text-red'}`}>
            {isProfit ? '+' : '−'}₹{Math.abs(t.netPnl || 0).toLocaleString('en-IN')}
          </div>
          <span className={t.side === 'LONG' ? 'badge-green text-[10px]' : 'badge-red text-[10px]'}>{t.side}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
        {[['Entry', `₹${t.entryPrice}`], ['Exit', `₹${t.exitPrice}`], ['Qty', t.quantity]].map(([l, v]) => (
          <div key={l}>
            <div className="text-textMid text-[10px]">{l}</div>
            <div className="font-mono font-medium">{v}</div>
          </div>
        ))}
      </div>
      {t.setup && <div className="text-[11px] text-textMid mb-1">Setup: <span className="text-white">{t.setup}</span></div>}
      {(t.mistakeTags || []).length > 0 && <MistakeTags tags={t.mistakeTags} />}
      <div className="flex justify-end mt-2">
        <button onClick={() => onDelete?.(t.id)} className="text-[11px] text-textMid hover:text-red transition-colors">Delete</button>
      </div>
    </div>
  )
}
