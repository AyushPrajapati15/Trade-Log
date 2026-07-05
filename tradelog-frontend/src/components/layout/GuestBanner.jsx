import { useNavigate } from 'react-router-dom'
import { useGuestStore } from '../../store/guestStore'

export default function GuestBanner() {
  const { secondsLeft, formatTime } = useGuestStore()
  const navigate = useNavigate()
  const pct = (secondsLeft / 300) * 100

  return (
    <div className="guest-banner px-4 py-2 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-6 h-6 rounded-full border-2 border-amber/40 flex-shrink-0 relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 bg-amber/30 transition-all duration-1000"
            style={{ height: `${pct}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-amber">
            {Math.ceil(secondsLeft / 60)}
          </span>
        </div>
        <span className="text-xs text-amber font-medium truncate">
          Try free for <span className="font-mono font-bold">{formatTime()}</span> — Sign up to save your data
        </span>
      </div>
      <button
        onClick={() => navigate('/signup')}
        className="flex-shrink-0 text-xs font-bold bg-amber text-black px-3 py-1 rounded-md hover:bg-amber/90 transition-colors"
      >
        Sign Up Free
      </button>
    </div>
  )
}
