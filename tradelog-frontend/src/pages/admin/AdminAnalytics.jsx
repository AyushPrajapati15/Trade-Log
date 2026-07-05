import { useEffect, useState } from 'react'
import { adminAPI, importAPI } from '../../services/api'
import PlatformStats from '../../components/admin/PlatformStats'
import toast from 'react-hot-toast'

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [importLogs, setImportLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminAPI.stats(), adminAPI.importLogs()])
      .then(([s, il]) => { setStats(s.data); setImportLogs(Array.isArray(il.data) ? il.data : []) })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <PlatformStats stats={stats} />

      <div className="card">
        <div className="font-semibold text-sm mb-4">Platform Import Logs</div>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-surface2 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : importLogs.length ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>User</th><th>Broker</th><th>File</th><th>Imported</th><th>Skipped</th><th>Date</th></tr>
              </thead>
              <tbody>
                {importLogs.map(log => (
                  <tr key={log.id}>
                    <td className="text-xs font-semibold">{log.userName || `uid:${log.userId}`}</td>
                    <td><span className="badge-blue text-[10px]">{log.broker}</span></td>
                    <td className="text-xs text-textMid truncate max-w-[160px]">{log.filename}</td>
                    <td className="font-mono text-xs text-accent font-bold">{log.imported}</td>
                    <td className="font-mono text-xs text-amber">{log.skipped}</td>
                    <td className="font-mono text-[11px] text-textMid">{log.importedAt?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-textMid text-sm">No import logs</div>
        )}
      </div>
    </div>
  )
}
