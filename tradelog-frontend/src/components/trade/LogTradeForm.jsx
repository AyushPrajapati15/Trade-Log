import { useState } from 'react'
import PnLPreview from './PnLPreview'
import { useTrades } from '../../hooks/useTrades'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const MISTAKE_TAGS = ['FOMO', 'No SL', 'Oversize', 'Revenge Trade', 'Early Exit', 'Late Entry', 'Overtrading', 'Chasing']
const SETUPS = ['Breakout', 'Reversal', 'Momentum', 'Scalp', 'Gap Fill', 'VWAP', 'Support/Resistance', 'Trend Follow']
const EMOTIONS = ['Calm', 'Confident', 'Anxious', 'FOMO', 'Revenge', 'Panic', 'Greedy', 'Fearful']

const INIT = {
  tradeDate: new Date().toISOString().slice(0, 10),
  symbol: '', segment: 'EQUITY', side: 'LONG',
  entryPrice: '', exitPrice: '', quantity: '',
  stopLoss: '', target: '', brokerage: '40',
  setup: 'Breakout', emotion: 'Calm',
  mistakeTags: [], notes: '',
}

export default function LogTradeForm({ isGuest }) {
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(false)
  const { createTrade } = useTrades()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleTag = (tag) => set('mistakeTags', form.mistakeTags.includes(tag)
    ? form.mistakeTags.filter(t => t !== tag)
    : [...form.mistakeTags, tag])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.symbol.trim()) { toast.error('Symbol is required'); return }
    if (isGuest || !isAuthenticated) { toast.error('Sign up to save trades!'); navigate('/signup'); return }

    setLoading(true)
    try {
      const payload = {
        ...form,
        entryPrice: parseFloat(form.entryPrice),
        exitPrice: parseFloat(form.exitPrice),
        quantity: parseFloat(form.quantity),
        stopLoss: parseFloat(form.stopLoss) || null,
        target: parseFloat(form.target) || null,
        brokerage: parseFloat(form.brokerage) || 0,
      }
      await createTrade(payload)
      setForm(INIT)
      navigate('/journal')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save trade')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      {isGuest && (
        <div className="bg-amber/10 border border-amber/20 rounded-xl p-3 mb-4 flex items-center gap-3">
          <span className="text-amber text-lg">⚠️</span>
          <div>
            <div className="text-xs font-semibold text-amber">Guest mode — data won't be saved</div>
            <div className="text-xs text-textMid">
              <button type="button" onClick={() => navigate('/signup')} className="text-amber underline">Sign up free</button> to save all your trades
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <div className="space-y-4">
          {/* Trade Details */}
          <div className="card">
            <div className="section-label mb-3 text-accent">Trade Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="section-label block mb-1.5">Date</label>
                <input type="date" className="input-base" value={form.tradeDate} onChange={e => set('tradeDate', e.target.value)} required />
              </div>
              <div>
                <label className="section-label block mb-1.5">Symbol</label>
                <input className="input-base uppercase" placeholder="NIFTY, RELIANCE…" value={form.symbol}
                  onChange={e => set('symbol', e.target.value.toUpperCase())} required />
              </div>
              <div>
                <label className="section-label block mb-1.5">Segment</label>
                <select className="select-base" value={form.segment} onChange={e => set('segment', e.target.value)}>
                  <option value="EQUITY">Equity</option>
                  <option value="FO_OPTIONS">F&O Options</option>
                  <option value="FO_FUTURES">F&O Futures</option>
                  <option value="CRYPTO">Crypto</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="section-label block mb-1.5">Side</label>
                <div className="flex gap-1.5">
                  {['LONG', 'SHORT'].map(s => (
                    <button key={s} type="button" onClick={() => set('side', s)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        form.side === s
                          ? s === 'LONG' ? 'bg-accent/10 text-accent border-accent/30' : 'bg-red/10 text-red border-red/20'
                          : 'bg-transparent text-textMid border-border hover:border-border2'
                      }`}>
                      {s === 'LONG' ? '↑ LONG' : '↓ SHORT'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="section-label block mb-1.5">Entry ₹</label>
                <input className="input-base mono" placeholder="0.00" value={form.entryPrice} onChange={e => set('entryPrice', e.target.value)} required />
              </div>
              <div>
                <label className="section-label block mb-1.5">Exit ₹</label>
                <input className="input-base mono" placeholder="0.00" value={form.exitPrice} onChange={e => set('exitPrice', e.target.value)} required />
              </div>
              <div>
                <label className="section-label block mb-1.5">Quantity</label>
                <input className="input-base mono" placeholder="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="section-label block mb-1.5">Stop Loss ₹</label>
                <input className="input-base mono" placeholder="0.00" value={form.stopLoss} onChange={e => set('stopLoss', e.target.value)} />
              </div>
              <div>
                <label className="section-label block mb-1.5">Target ₹</label>
                <input className="input-base mono" placeholder="0.00" value={form.target} onChange={e => set('target', e.target.value)} />
              </div>
              <div>
                <label className="section-label block mb-1.5">Brokerage ₹</label>
                <input className="input-base mono" placeholder="40" value={form.brokerage} onChange={e => set('brokerage', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Psychology */}
          <div className="card">
            <div className="section-label mb-3 text-accent">Psychology & Notes</div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="section-label block mb-1.5">Setup</label>
                <select className="select-base" value={form.setup} onChange={e => set('setup', e.target.value)}>
                  {SETUPS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="section-label block mb-1.5">Emotion</label>
                <select className="select-base" value={form.emotion} onChange={e => set('emotion', e.target.value)}>
                  {EMOTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="section-label block mb-2">Mistake Tags</label>
              <div className="flex flex-wrap gap-2">
                {MISTAKE_TAGS.map(tag => (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                      form.mistakeTags.includes(tag)
                        ? 'bg-amber/10 text-amber border-amber/30'
                        : 'bg-transparent text-textMid border-border hover:border-border2'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="section-label block mb-1.5">Notes / Reflection</label>
              <textarea
                className="input-base resize-none"
                rows={3}
                placeholder="Trade rationale, what worked, lessons learned…"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary btn btn-lg disabled:opacity-60">
            {loading ? 'Saving…' : isGuest ? 'Sign Up to Save Trade' : 'Save Trade'}
          </button>
        </div>

        {/* Preview panel */}
        <div className="hidden lg:block">
          <PnLPreview form={form} />
        </div>
      </div>
    </form>
  )
}
