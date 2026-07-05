import { useEffect, useState } from 'react'
import BrokerImport from '../components/import/BrokerImport'
import { importAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Import() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const loadLogs = async () => {
    try {
      const { data } = await importAPI.getLogs()
      setLogs(Array.isArray(data) ? data : [])
    } catch { toast.error('Failed to load import history') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadLogs() }, [])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Import Trades</h1>
          <p className="page-sub">Bulk import from broker CSV exports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upload panel */}
        <div className="card">
          <div className="section-label text-accent mb-4">Upload CSV</div>
          <BrokerImport onSuccess={loadLogs} />
        </div>

        {/* History panel */}
        <div className="card">
          <div className="section-label text-accent mb-4">Import History</div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 bg-surface2 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : logs.length ? (
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="flex items-center gap-3 p-3 bg-surface2 rounded-lg border border-border">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-lg flex-shrink-0">📄</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate">{log.filename}</div>
                    <div className="text-[11px] text-textMid mt-0.5">
                      {log.broker} · {log.importedAt?.slice(0, 10)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-xs text-accent font-bold">{log.imported} ✓</div>
                    {log.skipped > 0 && (
                      <div className="font-mono text-[10px] text-amber">{log.skipped} skipped</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">📥</div>
              <p className="text-sm text-textMid">No imports yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Guide */}
      <div className="card mt-5">
        <div className="section-label text-accent mb-3">How to export your CSV</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { broker: 'Zerodha', steps: ['Login to Zerodha Console', 'Go to Reports → Tradebook', 'Select date range and download CSV'], color: '#3B9EFF' },
            { broker: 'Upstox', steps: ['Login to Upstox Pro', 'Go to Reports → P&L', 'Select period and export CSV'], color: '#05E8B4' },
            { broker: 'Angel One', steps: ['Login to Angel One', 'Go to Reports → Trade Book', 'Download the trade report CSV'], color: '#FFB020' },
          ].map(({ broker, steps, color }) => (
            <div key={broker} className="bg-surface2 rounded-xl p-4 border border-border">
              <div className="font-semibold text-sm mb-2" style={{ color }}>{broker}</div>
              <ol className="space-y-1.5">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-textMid">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-border flex items-center justify-center text-[9px] font-bold mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
