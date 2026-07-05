import { useCallback } from 'react'
import { useTradeStore } from '../store/tradeStore'
import { tradeAPI } from '../services/api'
import toast from 'react-hot-toast'

export function useTrades() {
  const store = useTradeStore()

  const fetchTrades = useCallback(async (page = 0) => {
    try { await store.fetchTrades(page) }
    catch (e) { toast.error(e.response?.data?.message || 'Failed to load trades') }
  }, [])

  const deleteTrade = useCallback(async (id) => {
    try {
      await tradeAPI.delete(id)
      store.removeTrade(id)
      toast.success('Trade deleted')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete trade')
    }
  }, [])

  const createTrade = useCallback(async (payload) => {
    const { data } = await tradeAPI.create(payload)
    store.addTrade(data)
    toast.success('Trade logged successfully!')
    return data
  }, [])

  const updateTrade = useCallback(async (id, payload) => {
    const { data } = await tradeAPI.update(id, payload)
    store.updateTrade(id, data)
    toast.success('Trade updated')
    return data
  }, [])

  return { ...store, fetchTrades, deleteTrade, createTrade, updateTrade }
}
