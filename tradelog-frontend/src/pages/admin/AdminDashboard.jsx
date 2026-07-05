import { useEffect } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import PlatformStats from '../../components/admin/PlatformStats'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { stats, fetchStats } = useAdmin()

  useEffect(() => {
    fetchStats().catch(() => toast.error('Failed to load platform stats'))
  }, [])

  return (
    <div className="space-y-5">
      <PlatformStats stats={stats} />

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Trades This Month', value: stats.tradesThisMonth?.toLocaleString('en-IN') ?? '—', color: 'text-accent' },
            { label: 'Banned Users', value: stats.bannedUsers ?? 0, color: 'text-red' },
            { label: 'New This Month', value: stats.newSignupsThisMonth?.toLocaleString('en-IN') ?? '—', color: 'text-amber' },
            { label: 'DAU / MAU', value: stats.totalUsers ? `${((stats.activeToday / stats.totalUsers) * 100).toFixed(1)}%` : '—', color: 'text-blue' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card-sm text-center">
              <div className="section-label mb-1">{label}</div>
              <div className={`font-mono font-bold text-xl ${color}`}>{value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="font-semibold text-sm mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Manage Users', to: '/admin/users', icon: '👥', desc: 'View, ban, or delete users' },
            { label: 'All Trades', to: '/admin/trades', icon: '≡', desc: 'Browse all platform trades' },
            { label: 'Analytics', to: '/admin/analytics', icon: '↗', desc: 'Platform-wide analytics' },
          ].map(({ label, to, icon, desc }) => (
            <a key={to} href={to}
              className="bg-surface2 border border-border rounded-xl p-4 hover:border-border2 hover:bg-surface3 transition-all block">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-semibold text-sm mb-0.5">{label}</div>
              <div className="text-xs text-textMid">{desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
