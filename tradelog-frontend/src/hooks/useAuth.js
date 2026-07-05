import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, token, isAuthenticated, logout, loadProfile, setAuth, setUser } = useAuthStore()

  const isAdmin = user?.role === 'ADMIN'
  const isUser = isAuthenticated && !isAdmin

  return { user, token, isAuthenticated, isAdmin, isUser, logout, loadProfile, setAuth, setUser }
}
