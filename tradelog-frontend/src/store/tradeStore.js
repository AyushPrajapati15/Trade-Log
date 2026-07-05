import { create } from 'zustand'
import { tradeAPI } from '../services/api'

export const useTradeStore = create((set, get) => ({
  trades: [],
  total: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  filters: { segment: '', side: '', from: '', to: '' },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetchTrades: async (page = 0, size = 20) => {
    set({ loading: true })
    try {
      const { filters } = get()
      const params = { page, size }
      if (filters.segment) params.segment = filters.segment
      if (filters.side) params.side = filters.side
      if (filters.from) params.from = filters.from
      if (filters.to) params.to = filters.to
      const { data } = await tradeAPI.list(params)
      set({
        trades: data.content,
        total: data.totalElements,
        totalPages: data.totalPages,
        currentPage: page,
        loading: false,
      })
    } catch (e) {
      set({ loading: false })
      throw e
    }
  },

  addTrade: (trade) => set(s => ({ trades: [trade, ...s.trades], total: s.total + 1 })),

  removeTrade: (id) => set(s => ({ trades: s.trades.filter(t => t.id !== id), total: s.total - 1 })),

  updateTrade: (id, updated) =>
    set(s => ({ trades: s.trades.map(t => t.id === id ? { ...t, ...updated } : t) })),
}))
