import { useState } from 'react'
import MistakeTags from '../dashboard/MistakeTags'
import { useNavigate } from 'react-router-dom'

const SEG_BADGE = { EQUITY: 'badge-blue', FO_OPTIONS: 'badge-amber', FO_FUTURES: 'badge-blue', CRYPTO: 'badge-red' }
const SEG_LABEL = { EQUITY: 'EQ', FO_OPTIONS: 'OPT', FO_FUTURES: 'FUT', CRYPTO: 'CRY' }

export default function TradeTable({ trades = [], onDelete, loading }) {
  const navigate = useNavigate()

  if (loading) return (
    <div className="flex items-center justify-center py-16 text-textMid text-sm">
      <div className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin mr-2" />
      Loading trades…
    </div>
  )

  if (!trades.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">📋</div>
      <div className="font-semibold mb-1">No trades found</div>
      <p className="text-sm text-textMid mb-4">Start logging trades to see them here</p>
      <button onClick={() => navigate('/log')} className="btn-primary btn btn-md">
        + Log your first trade
      </button>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Symbol</th>
            <th>Seg</th>
            <th>Side</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Qty</th>
            <th>Net P&L</th>
            <th>Setup</th>
            <th>Tags</th>
            <th>Source</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {trades.map(t => (
            <tr key={t.id} className="cursor-pointer" onClick={() => {}}>
              <td className="font-mono text-[11px] text-textMid whitespace-nowrap">{t.tradeDate}</td>
              <td className="font-semibold whitespace-nowrap">{t.symbol}</td>
              <td><span className={SEG_BADGE[t.segment] || 'badge-dim'}>{SEG_LABEL[t.segment] || t.segment}</span></td>
              <td>
                <span className={t.side === 'LONG' ? 'badge-green' : 'badge-red'}>{t.side}</span>
              </td>
              <td className="font-mono text-xs">₹{t.entryPrice?.toLocaleString('en-IN')}</td>
              <td className="font-mono text-xs">₹{t.exitPrice?.toLocaleString('en-IN')}</td>
              <td className="font-mono text-xs">{t.quantity}</td>
              <td>
                <span className={t.netPnl >= 0 ? 'pnl-pos' : 'pnl-neg'}>
                  {t.netPnl >= 0 ? '+' : '−'}₹{Math.abs(t.netPnl || 0).toLocaleString('en-IN')}
                </span>
              </td>
              <td className="text-textMid text-xs">{t.setup || '—'}</td>
              <td><MistakeTags tags={t.mistakeTags || []} /></td>
              <td><span className="badge-dim text-[10px]">{t.source}</span></td>
              <td>
                <button
                  onClick={e => { e.stopPropagation(); onDelete?.(t.id) }}
                  className="btn-ghost btn btn-sm text-red hover:border-red/30 hover:text-red"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
