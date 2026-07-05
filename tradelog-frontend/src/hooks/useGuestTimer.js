import { useEffect } from 'react'
import { useGuestStore } from '../store/guestStore'
import { useAuthStore } from '../store/authStore'

export function useGuestTimer() {
  const { isAuthenticated } = useAuthStore()
  const { isGuest, secondsLeft, expired, initGuest, stopGuest, formatTime } = useGuestStore()

  useEffect(() => {
    if (!isAuthenticated && !isGuest) initGuest()
    if (isAuthenticated && isGuest) stopGuest()
  }, [isAuthenticated])

  return { isGuest, secondsLeft, expired, formatTime }
}
