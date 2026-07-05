import { create } from 'zustand'

const GUEST_DURATION = 5 * 60 // 5 minutes in seconds
const STORAGE_KEY = 'tradelog-guest-start'

export const useGuestStore = create((set, get) => ({
  isGuest: false,
  secondsLeft: GUEST_DURATION,
  expired: false,
  intervalRef: null,

  initGuest: () => {
    const existing = localStorage.getItem(STORAGE_KEY)
    const startTime = existing ? parseInt(existing) : Date.now()
    if (!existing) localStorage.setItem(STORAGE_KEY, startTime)

    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const secondsLeft = Math.max(0, GUEST_DURATION - elapsed)

    set({ isGuest: true, secondsLeft, expired: secondsLeft === 0 })

    if (secondsLeft > 0) {
      const ref = setInterval(() => {
        const el2 = Math.floor((Date.now() - startTime) / 1000)
        const left = Math.max(0, GUEST_DURATION - el2)
        set({ secondsLeft: left, expired: left === 0 })
        if (left === 0) clearInterval(get().intervalRef)
      }, 1000)
      set({ intervalRef: ref })
    }
  },

  stopGuest: () => {
    const { intervalRef } = get()
    if (intervalRef) clearInterval(intervalRef)
    localStorage.removeItem(STORAGE_KEY)
    set({ isGuest: false, secondsLeft: GUEST_DURATION, expired: false, intervalRef: null })
  },

  formatTime: () => {
    const { secondsLeft } = get()
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
    const s = (secondsLeft % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  },
}))
