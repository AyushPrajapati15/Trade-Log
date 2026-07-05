import { NavLink } from 'react-router-dom'

const MOBILE_NAV = [
  { to: '/dashboard', icon: '▦', label: 'Home' },
  { to: '/log', icon: '+', label: 'Log' },
  { to: '/journal', icon: '≡', label: 'Journal' },
  { to: '/analytics', icon: '↗', label: 'Analytics' },
]

export default function MobileNav() {
  return (
    <nav className="mobile-nav md:hidden">
      {MOBILE_NAV.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-accent' : 'text-textMid'
            }`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
