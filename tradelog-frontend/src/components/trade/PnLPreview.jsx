export default function PnLPreview({ form }) {
  const { side, entryPrice, exitPrice, quantity, brokerage } = form
  const e = parseFloat(entryPrice), x = parseFloat(exitPrice), q = parseFloat(quantity), b = parseFloat(brokerage || 0)
  const hasPnl = !isNaN(e) && !isNaN(x) && !isNaN(q) && e > 0 && x > 0 && q > 0

  const gross = hasPnl ? (side === 'LONG' ? (x - e) * q : (e - x) * q) : null
  const net = hasPnl ? gross - b : null
  const sl = parseFloat(form.stopLoss), tgt = parseFloat(form.target)
  const rr = hasPnl && !isNaN(sl) && !isNaN(tgt) && sl > 0 && tgt > 0
    ? Math.abs(tgt - e) / Math.abs(e - sl)
    : null
  const riskAmt = hasPnl && !isNaN(sl) && sl > 0 ? Math.abs(e - sl) * q : null

  return (
    <div className="card sticky top-0">
      <div className="section-label mb-3">P&L Preview</div>

      <div className="bg-bg rounded-xl p-4 text-center mb-4">
        {net !== null ? (
          <>
            <div className="text-[10px] text-textMid uppercase tracking-widest mb-1">Est. Net P&L</div>
            <div className={`font-mono text-3xl font-bold tracking-tight ${net >= 0 ? 'text-accent' : 'text-red'}`}>
              {net >= 0 ? '+' : '−'}₹{Math.abs(net).toLocaleString('en-IN')}
            </div>
            {b > 0 && <div className="text-[11px] text-textMid mt-1">After ₹{b} brokerage</div>}
          </>
        ) : (
          <div className="text-textMid text-xs leading-relaxed">
            Enter entry, exit<br />and quantity to preview
          </div>
        )}
      </div>

      {(rr !== null || riskAmt !== null) && (
        <div className="space-y-2 border-t border-border pt-3">
          {rr !== null && (
            <div className="flex justify-between text-xs">
              <span className="text-textMid">Risk / Reward</span>
              <span className="font-mono font-semibold">1 : {rr.toFixed(2)}</span>
            </div>
          )}
          {riskAmt !== null && (
            <div className="flex justify-between text-xs">
              <span className="text-textMid">Risk Amount</span>
              <span className="font-mono font-semibold">₹{riskAmt.toFixed(0)}</span>
            </div>
          )}
          {gross !== null && (
            <div className="flex justify-between text-xs">
              <span className="text-textMid">Gross P&L</span>
              <span className={`font-mono font-semibold ${gross >= 0 ? 'text-accent' : 'text-red'}`}>
                {gross >= 0 ? '+' : '−'}₹{Math.abs(gross).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
