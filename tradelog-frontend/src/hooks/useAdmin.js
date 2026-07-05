import { useState, useCallback } from 'react'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

export function useAdmin() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchStats = useCallback(async () => {
    const { data } = await adminAPI.stats()
    setStats(data)
    return data
  }, [])

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await adminAPI.users(params)
      setUsers(data.content)
      setTotalUsers(data.totalElements)
    } finally { setLoading(false) }
  }, [])

  const banUser = useCallback(async (id, reason = 'Admin action') => {
    await adminAPI.banUser(id, reason)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'BANNED' } : u))
    toast.success('User banned')
  }, [])

  const unbanUser = useCallback(async (id) => {
    await adminAPI.unbanUser(id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'ACTIVE' } : u))
    toast.success('User unbanned')
  }, [])

  const deleteUser = useCallback(async (id) => {
    await adminAPI.deleteUser(id)
    setUsers(prev => prev.filter(u => u.id !== id))
    toast.success('User deleted')
  }, [])

  return { stats, users, totalUsers, loading, fetchStats, fetchUsers, banUser, unbanUser, deleteUser }
}
