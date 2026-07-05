import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/journal', icon: '≡', label: 'Journal' },
  { to: '/log', icon: '+', label: 'Log Trade' },
  { to: '/analytics', icon: '↗', label: 'Analytics' },
  { to: '/import', icon: '↓', label: 'Import' },
]

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    toast.success('Signed out')
  }

  return (
    <aside
      className={`hidden md:flex flex-col h-screen bg-surface border-r border-border fixed left-0 top-0 z-40 transition-all duration-250 ${collapsed ? 'w-14' : 'w-[200px]'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3.5 py-4 border-b border-border min-h-[60px]">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-display font-black text-[17px] text-black flex-shrink-0">T</div>
        {!collapsed && (
          <div className="animate-fade-in">
            <div className="font-display font-extrabold text-[15px] tracking-tight leading-none">TradeLog</div>
            <div className="text-[9px] font-bold text-accent tracking-[0.15em] mt-0.5">INDIA</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="ml-auto text-textMid hover:text-white transition-colors text-xs p-1 flex-shrink-0"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-1.5 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all border-l-2 ${
                isActive
                  ? 'bg-accent/10 text-accent border-accent'
                  : 'text-textMid border-transparent hover:bg-surface2 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : ''}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="animate-fade-in truncate">{item.label}</span>}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className={`my-2 border-t border-border ${collapsed ? 'mx-1' : 'mx-2'}`} />
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all border-l-2 ${
                  isActive ? 'bg-red/10 text-red border-red' : 'text-textMid border-transparent hover:bg-surface2 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? 'Admin' : ''}
            >
              <span className="text-base w-5 text-center flex-shrink-0">◈</span>
              {!collapsed && (
                <span className="animate-fade-in flex-1 truncate">Admin</span>
              )}
              {!collapsed && (
                <span className="badge-red text-[9px] px-1.5 py-0.5 rounded font-bold">ADMIN</span>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-border p-2.5">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <div className="text-xs font-semibold truncate">{user?.name || 'User'}</div>
              <div className="text-[10px] text-textMid truncate">{user?.broker} · {user?.role}</div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-[10px] text-textMid hover:text-red transition-colors px-1.5 py-1 rounded border border-border hover:border-red/30 flex-shrink-0"
              title="Sign out"
            >
              Exit
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center mt-2 text-[10px] text-textMid hover:text-red transition-colors"
            title="Sign out"
          >
            ↩
          </button>
        )}
      </div>
    </aside>
  )
}
