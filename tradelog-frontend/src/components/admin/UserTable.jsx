import { useState } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const STATUS_BADGE = { ACTIVE: 'badge-green', BANNED: 'badge-red', UNVERIFIED: 'badge-amber' }

export default function UserTable({ users = [], onAction, loading }) {
  const [expandedId, setExpandedId] = useState(null)
  const [userTrades, setUserTrades] = useState({})

  const loadUserTrades = async (userId) => {
    if (userTrades[userId]) { setExpandedId(expandedId === userId ? null : userId); return }
    try {
      const { data } = await adminAPI.userTrades(userId, { page: 0, size: 10 })
      setUserTrades(t => ({ ...t, [userId]: data.content }))
      setExpandedId(userId)
    } catch { toast.error('Failed to load user trades') }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16 text-textMid text-sm">
      <div className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin mr-2" />
      Loading users…
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Broker</th>
            <th>Trades</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <>
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                      {(u.name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-xs">{u.name}</div>
                      <div className="text-[10px] text-textMid">#{u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="text-xs text-textMid">{u.email}</td>
                <td className="text-xs font-mono text-textMid">{u.mobile || '—'}</td>
                <td><span className="badge-blue text-[10px]">{u.broker}</span></td>
                <td className="font-mono font-semibold text-xs">{u.tradeCount ?? '—'}</td>
                <td><span className={STATUS_BADGE[u.status] || 'badge-dim'}>{u.status}</span></td>
                <td className="text-xs text-textMid">{u.createdAt?.slice(0, 10)}</td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => loadUserTrades(u.id)}
                      className="btn-ghost btn btn-sm text-[10px]">
                      {expandedId === u.id ? 'Hide' : 'Trades'}
                    </button>
                    {u.status === 'ACTIVE'
                      ? <button onClick={() => onAction('ban', u.id)} className="btn-danger btn btn-sm text-[10px]">Ban</button>
                      : u.status === 'BANNED'
                      ? <button onClick={() => onAction('unban', u.id)} className="btn-success btn btn-sm text-[10px]">Unban</button>
                      : null}
                    <button onClick={() => {
                      if (confirm(`Delete ${u.name}? This is irreversible.`)) onAction('delete', u.id)
                    }} className="btn-ghost btn btn-sm text-[10px] text-red hover:border-red/30">Del</button>
                  </div>
                </td>
              </tr>
              {expandedId === u.id && userTrades[u.id] && (
                <tr key={`${u.id}-trades`}>
                  <td colSpan={8} className="bg-surface2 px-4 py-3">
                    <div className="text-[10px] font-bold text-textMid mb-2">Recent trades for {u.name}</div>
                    {userTrades[u.id].length ? (
                      <table className="data-table text-[11px]">
                        <thead><tr><th>Date</th><th>Symbol</th><th>Side</th><th>Net P&L</th><th>Setup</th></tr></thead>
                        <tbody>
                          {userTrades[u.id].map(t => (
                            <tr key={t.id}>
                              <td className="font-mono text-[10px]">{t.tradeDate}</td>
                              <td className="font-semibold">{t.symbol}</td>
                              <td><span className={t.side === 'LONG' ? 'badge-green' : 'badge-red'}>{t.side}</span></td>
                              <td className={t.netPnl >= 0 ? 'pnl-pos' : 'pnl-neg'}>
                                {t.netPnl >= 0 ? '+' : '−'}₹{Math.abs(t.netPnl || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="text-textMid">{t.setup || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : <div className="text-textMid text-xs">No trades found</div>}
                  </td>
                </tr>
              )}
            </>
          ))}
          {!users.length && (
            <tr><td colSpan={8} className="text-center py-10 text-textMid text-sm">No users found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
