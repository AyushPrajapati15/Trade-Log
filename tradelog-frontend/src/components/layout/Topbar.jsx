import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/journal': 'Trade Journal',
  '/log': 'Log Trade',
  '/analytics': 'Analytics',
  '/import': 'Import Trades',
  '/admin': 'Admin Panel',
  '/profile': 'My Profile',
}

export default function Topbar() {
  const location = useLocation()
  const { user } = useAuth()
  const title = PAGE_TITLES[location.pathname] || 'TradeLog'

  return (
    <header className="h-[60px] bg-surface border-b border-border flex items-center justify-between px-5 md:px-6 sticky top-0 z-30">
      {/* Mobile logo + page title */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center font-display font-black text-sm text-black">T</div>
        </div>
        <h1 className="font-display font-bold text-base tracking-tight">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-xs text-textMid">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>Live</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold leading-none">{user?.name}</div>
            <div className="text-[10px] text-textMid mt-0.5">{user?.broker}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
