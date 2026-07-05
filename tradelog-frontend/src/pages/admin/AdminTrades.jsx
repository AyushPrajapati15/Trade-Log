import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminTrades() {
  const [trades, setTrades] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const pageSize = 20

  const load = async (p = 0, uid = userId) => {
    setLoading(true)
    try {
      const params = { page: p, size: pageSize }
      if (uid) params.userId = uid
      const { data } = await adminAPI.trades(params)
      setTrades(data.content); setTotal(data.totalElements)
    } catch { toast.error('Failed to load trades') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          <input className="input-base w-48" placeholder="Filter by User ID…" value={userId} onChange={e => setUserId(e.target.value)} />
          <button onClick={() => { setPage(0); load(0) }} className="btn-ghost btn btn-md">Filter</button>
          {userId && <button onClick={() => { setUserId(''); setPage(0); load(0, '') }} className="btn-ghost btn btn-md text-red">Clear</button>}
        </div>
        <span className="text-xs text-textMid ml-auto">{total.toLocaleString('en-IN')} trades</span>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>User</th><th>Date</th><th>Symbol</th>
                <th>Side</th><th>Net P&L</th><th>Setup</th><th>Source</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-textMid">
                  <div className="inline-flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin" />Loading…
                  </div>
                </td></tr>
              ) : trades.length ? trades.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-[11px] text-textMid">#{t.id}</td>
                  <td>
                    <div className="text-xs font-semibold">{t.userName}</div>
                    <div className="text-[10px] text-textMid">uid:{t.userId}</div>
                  </td>
                  <td className="font-mono text-[11px] text-textMid">{t.tradeDate}</td>
                  <td className="font-semibold text-xs">{t.symbol}</td>
                  <td><span className={t.side === 'LONG' ? 'badge-green' : 'badge-red'}>{t.side}</span></td>
                  <td className={t.netPnl >= 0 ? 'pnl-pos' : 'pnl-neg'}>
                    {t.netPnl >= 0 ? '+' : '−'}₹{Math.abs(t.netPnl || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="text-xs text-textMid">{t.setup || '—'}</td>
                  <td><span className="badge-dim text-[10px]">{t.source}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="text-center py-10 text-textMid text-sm">No trades found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-textMid">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button disabled={page === 0} onClick={() => { setPage(p => p - 1); load(page - 1) }}
                className="btn-ghost btn btn-sm disabled:opacity-40">← Prev</button>
              <button disabled={page >= totalPages - 1} onClick={() => { setPage(p => p + 1); load(page + 1) }}
                className="btn-ghost btn btn-sm disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
