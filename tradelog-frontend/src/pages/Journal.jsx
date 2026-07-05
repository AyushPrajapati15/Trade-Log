import { useEffect, useState } from 'react'
import { useTrades } from '../hooks/useTrades'
import TradeTable from '../components/trade/TradeTable'
import TradeCard from '../components/trade/TradeCard'
import TradeFilters from '../components/trade/TradeFilters'
import { useNavigate } from 'react-router-dom'

export default function Journal() {
  const { trades, total, totalPages, currentPage, loading, fetchTrades, deleteTrade } = useTrades()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  useEffect(() => {
    fetchTrades(0)
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this trade? This cannot be undone.')) return
    await deleteTrade(id)
  }

  const handleFilterChange = () => fetchTrades(0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Trade Journal</h1>
          <p className="page-sub">{total} trades logged</p>
        </div>
        <button onClick={() => navigate('/log')} className="btn-primary btn btn-md">
          + Log Trade
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Filters */}
        <div className="p-3 border-b border-border overflow-x-auto">
          <TradeFilters onFilter={handleFilterChange} />
        </div>

        {/* Desktop table / Mobile cards */}
        {isMobile ? (
          <div className="p-3">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-textMid text-sm">
                <div className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin mr-2" />
                Loading…
              </div>
            ) : trades.length ? (
              trades.map(t => <TradeCard key={t.id} trade={t} onDelete={handleDelete} />)
            ) : (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-sm text-textMid mb-3">No trades found</p>
                <button onClick={() => navigate('/log')} className="btn-primary btn btn-md">Log first trade</button>
              </div>
            )}
          </div>
        ) : (
          <TradeTable trades={trades} onDelete={handleDelete} loading={loading} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-textMid">
              Page {currentPage + 1} of {totalPages} · {total} trades
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 0}
                onClick={() => fetchTrades(currentPage - 1)}
                className="btn-ghost btn btn-sm disabled:opacity-40"
              >← Prev</button>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => fetchTrades(currentPage + 1)}
                className="btn-ghost btn btn-sm disabled:opacity-40"
              >Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
