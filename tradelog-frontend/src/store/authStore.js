import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI, userAPI } from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (data) => {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        set({
          user: data.user,
          token: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        })
      },

      setUser: (user) => set({ user }),

      logout: async () => {
        const rt = get().refreshToken || localStorage.getItem('refreshToken')
        try { if (rt) await authAPI.logout(rt) } catch (_) {}
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
      },

      loadProfile: async () => {
  try {
    const { data } = await userAPI.getProfile()
    // Explicitly confirm authentication state is kept true on valid profile return paths
    set({ user: data, isAuthenticated: true })
    return data
  } catch (error) {
    // If the backend returns a 403 or 401 on initialization, clear out stale fields safely
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
    return null
  }
},

      updateProfile: async (payload) => {
        const { data } = await userAPI.updateProfile(payload)
        set({ user: data.user || data })
        return data
      },
    }),
    {
      name: 'tradelog-auth',
      partialize: (s) => ({ user: s.user, token: s.token, refreshToken: s.refreshToken, isAuthenticated: s.isAuthenticated }),
    }
  )
)
