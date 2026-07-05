import { useEffect, useState } from 'react'
import { analyticsAPI } from '../services/api'
import StatCard from '../components/dashboard/StatCard'
import MonthlyBar from '../components/analytics/MonthlyBar'
import SetupChart from '../components/analytics/SetupChart'
import MistakeImpact from '../components/analytics/MistakeImpact'
import CalendarStrip from '../components/dashboard/CalendarStrip'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function Analytics() {
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [bySetup, setBySetup] = useState([])
  const [mistakes, setMistakes] = useState([])
  const [calendar, setCalendar] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, m, st, mk, cal] = await Promise.all([
          analyticsAPI.summary(),
          analyticsAPI.monthly(),
          analyticsAPI.bySetup(),
          analyticsAPI.mistakes(),
          analyticsAPI.calendar(),
        ])
        setSummary(s.data); setMonthly(m.data); setBySetup(st.data)
        setMistakes(mk.data); setCalendar(cal.data)
      } catch (e) {
        toast.error('Failed to load analytics')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const s = summary || {}

  const Loader = () => (
    <div className="h-32 flex items-center justify-center text-textMid text-sm">
      <div className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin mr-2" />
      Loading…
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Deep dive into your trading performance</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Net P&L" value={`₹${Math.abs(s.totalNetPnl || 0).toLocaleString('en-IN')}`} color={s.totalNetPnl >= 0 ? '#05E8B4' : '#FF3D6B'} sub="All time" />
        <StatCard label="Win Rate" value={`${(s.winRate || 0).toFixed(1)}%`} color="#3B9EFF" sub={`${s.winningTrades || 0}W · ${s.losingTrades || 0}L`} />
        <StatCard label="Profit Factor" value={(s.profitFactor || 0).toFixed(2)} color="#05E8B4" sub="Gross win / loss" />
        <StatCard label="Total Trades" value={s.totalTrades || 0} color="#FFB020" sub="Logged trades" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Avg Win" value={`₹${Math.abs(s.avgWin || 0).toLocaleString('en-IN')}`} color="#05E8B4" />
        <StatCard label="Avg Loss" value={`₹${Math.abs(s.avgLoss || 0).toLocaleString('en-IN')}`} color="#FF3D6B" />
        <StatCard label="Best Trade" value={`₹${Math.abs(s.bestTrade || 0).toLocaleString('en-IN')}`} color="#05E8B4" />
        <StatCard label="Worst Trade" value={`₹${Math.abs(s.worstTrade || 0).toLocaleString('en-IN')}`} color="#FF3D6B" />
      </div>

      {/* Monthly + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="font-semibold text-sm mb-3">Monthly P&L</div>
          {loading ? <Loader /> : <MonthlyBar data={monthly} />}
        </div>
        <div className="card">
          <div className="font-semibold text-sm mb-3">Trading Calendar — {format(new Date(), 'MMM yyyy')}</div>
          {loading ? <Loader /> : <CalendarStrip data={calendar} />}
        </div>
      </div>

      {/* Setup + Mistakes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="font-semibold text-sm mb-4">P&L by Setup</div>
          {loading ? <Loader /> : <SetupChart data={bySetup} />}
        </div>
        <div className="card">
          <div className="font-semibold text-sm mb-4">Mistake Impact Analysis</div>
          {loading ? <Loader /> : <MistakeImpact data={mistakes} />}
        </div>
      </div>
    </div>
  )
}
