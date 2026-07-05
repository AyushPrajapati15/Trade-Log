import { useEffect, useState } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import UserTable from '../../components/admin/UserTable'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const { users, totalUsers, loading, fetchUsers, banUser, unbanUser, deleteUser } = useAdmin()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 20

  const load = (p = 0, s = search) => fetchUsers({ page: p, size: pageSize, search: s })

  useEffect(() => { load(0) }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    load(0, search)
  }

  const handleAction = async (action, id) => {
    try {
      if (action === 'ban') await banUser(id)
      else if (action === 'unban') await unbanUser(id)
      else if (action === 'delete') await deleteUser(id)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed')
    }
  }

  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <div className="space-y-4">
      {/* Search + count */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            className="input-base w-64"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-ghost btn btn-md">Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); load(0, '') }}
              className="btn-ghost btn btn-md text-red">Clear</button>
          )}
        </form>
        <span className="text-xs text-textMid">{totalUsers.toLocaleString('en-IN')} users</span>
      </div>

      <div className="card p-0 overflow-hidden">
        <UserTable users={users} onAction={handleAction} loading={loading} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-textMid">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button disabled={page === 0} onClick={() => { setPage(p => p - 1); load(page - 1) }}
                className="btn-ghost btn btn-sm disabled:opacity-40">← Prev</button>
              <button disabled={page >= totalPages - 1} onClick={() => { setPage(p => p + 1); load(page + 1) }}
                className="btn-ghost btn btn-sm disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
