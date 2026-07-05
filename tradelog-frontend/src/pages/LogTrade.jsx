import LogTradeForm from '../components/trade/LogTradeForm'
import { useAuthStore } from '../store/authStore'
import { useGuestStore } from '../store/guestStore'

export default function LogTrade() {
  const { isAuthenticated } = useAuthStore()
  const { isGuest } = useGuestStore()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Log Trade</h1>
          <p className="page-sub">Record a new trade entry</p>
        </div>
      </div>
      <LogTradeForm isGuest={!isAuthenticated && isGuest} />
    </div>
  )
}
