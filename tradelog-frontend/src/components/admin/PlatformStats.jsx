import StatCard from '../dashboard/StatCard'

export default function PlatformStats({ stats }) {
  if (!stats) return (
    <div className="sg grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({length:4}).map((_,i) => (
        <div key={i} className="stat-card animate-pulse">
          <div className="pl-3">
            <div className="h-2 bg-surface2 rounded w-20 mb-3" />
            <div className="h-6 bg-surface2 rounded w-28" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="Total Users" value={stats.totalUsers?.toLocaleString('en-IN') ?? '—'} color="#3B9EFF" sub="Registered accounts" />
      <StatCard label="Active Today" value={stats.activeToday?.toLocaleString('en-IN') ?? '—'} color="#05E8B4" sub="Daily active users" />
      <StatCard label="Total Trades" value={stats.totalTrades?.toLocaleString('en-IN') ?? '—'} color="#05E8B4" sub="All time" />
      <StatCard label="New Signups" value={stats.newSignupsToday?.toLocaleString('en-IN') ?? '—'} color="#FFB020" sub={`${stats.newSignupsThisMonth ?? 0} this month`} />
    </div>
  )
}
