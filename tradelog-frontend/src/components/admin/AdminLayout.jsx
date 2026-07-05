import { NavLink } from 'react-router-dom'

const ADMIN_NAV = [
  { to: '/admin', label: 'Overview', icon: '▦', end: true },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/trades', label: 'Trades', icon: '≡' },
  { to: '/admin/analytics', label: 'Analytics', icon: '↗' },
]

export default function AdminLayout({ children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded bg-red/10 border border-red/20 flex items-center justify-center text-xs text-red">◈</div>
        <h1 className="font-display font-extrabold text-xl tracking-tight">Admin Panel</h1>
        <span className="badge-red ml-1">ADMIN</span>
      </div>

      {/* Admin tab nav */}
      <div className="tab-bar border-b border-border mb-5">
        {ADMIN_NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => `tab-item ${isActive ? 'on' : ''}`}
          >
            <span className="mr-1.5">{n.icon}</span>{n.label}
          </NavLink>
        ))}
      </div>

      {children}
    </div>
  )
}
