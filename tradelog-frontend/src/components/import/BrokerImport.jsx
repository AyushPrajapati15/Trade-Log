import { useRef, useState } from 'react'
import { importAPI } from '../../services/api'
import toast from 'react-hot-toast'

const BROKERS = [
  { id: 'ZERODHA', label: 'Zerodha', hint: 'tradebook.csv from Zerodha Console' },
  { id: 'UPSTOX', label: 'Upstox', hint: 'P&L Report CSV from Upstox' },
  { id: 'ANGEL', label: 'Angel One', hint: 'Trade report CSV from Angel One' },
]

export default function BrokerImport({ onSuccess }) {
  const [broker, setBroker] = useState('ZERODHA')
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const inputRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.csv')) { setFile(f); setResult(null) }
    else toast.error('Please drop a CSV file')
  }

  const handleImport = async () => {
    if (!file) { toast.error('Select a file first'); return }
    setLoading(true)
    try {
      const apiCall = { ZERODHA: importAPI.zerodha, UPSTOX: importAPI.upstox, ANGEL: importAPI.angel }[broker]
      const { data } = await apiCall(file)
      setResult(data)
      toast.success(`Imported ${data.imported} trades from ${broker}`)
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed')
    } finally { setLoading(false) }
  }

  const reset = () => { setFile(null); setResult(null); if (inputRef.current) inputRef.current.value = '' }

  return (
    <div className="space-y-4">
      {/* Broker selector */}
      <div>
        <div className="section-label mb-2">Select Broker</div>
        <div className="flex gap-2">
          {BROKERS.map(b => (
            <button key={b.id} onClick={() => { setBroker(b.id); reset() }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg border transition-all ${
                broker === b.id ? 'bg-accent/10 text-accent border-accent/30' : 'text-textMid border-border hover:border-border2 hover:text-white bg-transparent'
              }`}>
              {b.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-textMid mt-1.5">
          {BROKERS.find(b => b.id === broker)?.hint}
        </p>
      </div>

      {/* Drop zone */}
      {!result && (
        <div
          className={`drop-zone p-8 text-center cursor-pointer flex flex-col items-center gap-3 ${dragging ? 'drag-over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input ref={inputRef} type="file" accept=".csv" className="hidden"
            onChange={e => { const f = e.target.files[0]; if (f) { setFile(f); setResult(null) } }} />
          <div className="text-3xl">{file ? '📄' : '📥'}</div>
          {file ? (
            <>
              <div className="font-semibold text-sm">{file.name}</div>
              <div className="text-xs text-textMid">{(file.size / 1024).toFixed(1)} KB · Ready to import</div>
            </>
          ) : (
            <>
              <div className="font-semibold text-sm">Drop {broker} CSV here</div>
              <div className="text-xs text-textMid">or click to browse files</div>
            </>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 animate-fade-up">
          <div className="font-semibold text-sm text-accent mb-3">✓ Import Complete</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Imported', val: result.imported, color: 'text-accent' },
              { label: 'Skipped', val: result.skipped, color: 'text-amber' },
              { label: 'Total', val: result.totalRows, color: 'text-white' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className={`font-mono text-2xl font-bold ${color}`}>{val}</div>
                <div className="text-[11px] text-textMid mt-1">{label}</div>
              </div>
            ))}
          </div>
          <button onClick={reset} className="btn-ghost btn btn-md w-full mt-4 text-xs">
            Import another file
          </button>
        </div>
      )}

      {file && !result && (
        <button onClick={handleImport} disabled={loading}
          className="btn-primary btn btn-lg disabled:opacity-60">
          {loading ? 'Importing…' : `Import to ${broker}`}
        </button>
      )}
    </div>
  )
}
