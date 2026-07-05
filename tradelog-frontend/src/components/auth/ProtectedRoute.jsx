import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useGuestStore } from '../../store/guestStore'
import ExpiredModal from './ExpiredModal'

export default function ProtectedRoute({ children, adminOnly = false, allowGuest = false }) {
  const { isAuthenticated, user } = useAuthStore()
  const { isGuest, expired } = useGuestStore()
  const location = useLocation()

  // Admin-only routes
  if (adminOnly) {
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
    if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
    return children
  }

  // Authenticated
  if (isAuthenticated) return children

  // Guest allowed (dashboard, log form in preview mode)
  if (allowGuest && isGuest) {
    if (expired) return <ExpiredModal />
    return children
  }

  // Not authenticated and not a guest — redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />
}
