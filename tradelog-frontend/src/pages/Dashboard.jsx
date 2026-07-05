import { useEffect, useState } from 'react'
import { analyticsAPI } from '../services/api'
import { useTradeStore } from '../store/tradeStore'
import { useAuthStore } from '../store/authStore'
import StatCard from '../components/dashboard/StatCard'
import EquityCurve from '../components/dashboard/EquityCurve'
import WinLossDonut from '../components/dashboard/WinLossDonut'
import CalendarStrip from '../components/dashboard/CalendarStrip'
import MonthlyBar from '../components/analytics/MonthlyBar'
import { format } from 'date-fns'

// Mock guest data
const GUEST_SUMMARY = { totalTrades: 24, winningTrades: 15, losingTrades: 9, winRate: 62.5, totalNetPnl: 48200, avgWin: 4200, avgLoss: -1800, profitFactor: 1.94, maxDrawdown: -8400 }
const GUEST_MONTHLY = [
  { month: '2024-10', netPnl: 12400, trades: 8 }, { month: '2024-11', netPnl: -3200, trades: 6 },
  { month: '2024-12', netPnl: 18600, trades: 10 }, { month: '2025-01', netPnl: 9800, trades: 7 },
  { month: '2025-02', netPnl: -4800, trades: 5 }, { month: '2025-03', netPnl: 15400, trades: 9 },
]
const GUEST_CAL = { '2025-03-03': 2400, '2025-03-04': -1200, '2025-03-05': 3800, '2025-03-07': -800, '2025-03-10': 5200, '2025-03-11': 1600, '2025-03-12': -600 }

function Skeleton() {
  return <div className="h-5 bg-surface2 rounded animate-pulse" />
}

export default function Dashboard() {
  const { isAuthenticated } = useAuthStore()
  const { trades, fetchTrades } = useTradeStore()
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [calendar, setCalendar] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setSummary(GUEST_SUMMARY); setMonthly(GUEST_MONTHLY); setCalendar(GUEST_CAL); setLoading(false); return
    }
    const load = async () => {
      try {
        const [s, m, c] = await Promise.all([
          analyticsAPI.summary(), analyticsAPI.monthly(), analyticsAPI.calendar()
        ])
        setSummary(s.data); setMonthly(m.data); setCalendar(c.data)
        await fetchTrades()
      } catch (e) {
        console.error(e)
      } finally { setLoading(false) }
    }
    load()
  }, [isAuthenticated])

  // Build cumulative equity curve from trades
  const equityData = (() => {
    let cum = 0
    return [...trades].reverse().map(t => ({
      date: t.tradeDate,
      cumPnl: (cum += t.netPnl || 0),
    }))
  })()

  const s = summary || {}
  const fmt = (v) => v !== undefined ? `₹${Math.abs(v).toLocaleString('en-IN')}` : '—'

  return (
    <div className="space-y-5">
      {!isAuthenticated && (
        <div className="bg-blue/10 border border-blue/20 rounded-xl p-3 flex items-center gap-3">
          <span className="text-blue text-lg">👁</span>
          <div>
            <div className="text-xs font-semibold text-blue">Viewing demo data</div>
            <div className="text-xs text-textMid">Sign up to track your real trades and see your actual performance</div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 snap-scroll overflow-x-auto pb-1">
        <StatCard label="Net P&L" value={loading ? '…' : fmt(s.totalNetPnl)} color={s.totalNetPnl >= 0 ? '#05E8B4' : '#FF3D6B'} sub="All time" />
        <StatCard label="Win Rate" value={loading ? '…' : `${(s.winRate || 0).toFixed(1)}%`} color="#3B9EFF" sub={`${s.winningTrades || 0}W · ${s.losingTrades || 0}L`} />
        <StatCard label="Profit Factor" value={loading ? '…' : (s.profitFactor || 0).toFixed(2)} color="#05E8B4" sub="Gross win / gross loss" />
        <StatCard label="Max Drawdown" value={loading ? '…' : fmt(s.maxDrawdown)} color="#FF3D6B" sub="Worst peak-to-trough" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm">Equity Curve</span>
            <span className={`font-mono text-xs font-bold ${s.totalNetPnl >= 0 ? 'text-accent' : 'text-red'}`}>
              {s.totalNetPnl >= 0 ? '+' : '−'}{fmt(s.totalNetPnl)}
            </span>
          </div>
          <EquityCurve data={equityData} />
        </div>
        <div className="card flex flex-col items-center justify-center">
          <div className="font-semibold text-sm mb-1 w-full">Win / Loss</div>
          <WinLossDonut wins={s.winningTrades || 0} losses={s.losingTrades || 0} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="font-semibold text-sm mb-3">Monthly P&L</div>
          <MonthlyBar data={monthly} />
        </div>
        <div className="card">
          <div className="font-semibold text-sm mb-3">
            Trading Calendar — {format(new Date(), 'MMM yyyy')}
          </div>
          <CalendarStrip data={calendar} />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Best Trade', value: fmt(s.bestTrade), color: 'text-accent' },
          { label: 'Worst Trade', value: fmt(s.worstTrade), color: 'text-red' },
          { label: 'Avg Win', value: fmt(s.avgWin), color: 'text-accent' },
          { label: 'Avg Loss', value: fmt(s.avgLoss), color: 'text-red' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card-sm text-center">
            <div className="section-label mb-1">{label}</div>
            <div className={`font-mono font-bold text-base ${color}`}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
