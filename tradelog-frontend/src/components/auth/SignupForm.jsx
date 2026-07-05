import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import { useGuestStore } from '../../store/guestStore'
import OtpInput from './OtpInput'
import GoogleOAuthButton from './GoogleOAuthButton'
import toast from 'react-hot-toast'

const BROKERS = ['ZERODHA', 'UPSTOX', 'ANGEL', 'OTHER', 'NONE']

const StepIndicator = ({ step }) => (
  <div className="flex items-center gap-2 mb-6">
    {['Details', 'Email OTP', 'Mobile OTP'].map((label, i) => (
      <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
        <div className="flex flex-col items-center gap-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i + 1 < step ? 'bg-accent text-black' : i + 1 === step ? 'bg-accent/20 text-accent border border-accent' : 'bg-surface2 text-textMid border border-border'
          }`}>
            {i + 1 < step ? '✓' : i + 1}
          </div>
          <span className={`text-[9px] font-semibold whitespace-nowrap ${i + 1 === step ? 'text-accent' : 'text-textMid'}`}>{label}</span>
        </div>
        {i < 2 && <div className={`flex-1 h-px mb-4 transition-all ${i + 1 < step ? 'bg-accent' : 'bg-border'}`} />}
      </div>
    ))}
  </div>
)

export default function SignupForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', broker: 'ZERODHA' })
  const [emailOtp, setEmailOtp] = useState('')
  const [mobileOtp, setMobileOtp] = useState('')
  const { setAuth } = useAuthStore()
  const { stopGuest } = useGuestStore()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Step 1: Register
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.register(form)
      await authAPI.sendEmailOtp(form.email)
      toast.success('OTP sent to ' + form.email)
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  // Step 2: Verify email OTP
  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    if (emailOtp.length < 6) { toast.error('Enter 6-digit OTP'); return }
    setLoading(true)
    try {
      await authAPI.verifyEmailOtp(form.email, emailOtp)
      await authAPI.sendMobileOtp(form.mobile, 'MOBILE_VERIFY')
      toast.success('Email verified! OTP sent to +91 ' + form.mobile)
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally { setLoading(false) }
  }

  // Step 3: Verify mobile OTP → get JWT
  const handleVerifyMobile = async (e) => {
    e.preventDefault()
    if (mobileOtp.length < 6) { toast.error('Enter 6-digit OTP'); return }
    setLoading(true)
    try {
      const { data } = await authAPI.verifyMobileOtp(form.mobile, mobileOtp)
      setAuth(data); stopGuest()
      toast.success('Account created! Welcome to TradeLog 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <StepIndicator step={step} />

      {step === 1 && (
        <form onSubmit={handleRegister} className="space-y-3 animate-fade-up">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="section-label block mb-1.5">Full Name</label>
              <input className="input-base" placeholder="Arjun Sharma" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="section-label block mb-1.5">Mobile</label>
              <div className="flex">
                <span className="bg-surface2 border border-border border-r-0 rounded-l-lg px-2.5 text-xs text-textMid flex items-center">+91</span>
                <input className="input-base rounded-l-none flex-1" type="tel" placeholder="9876543210"
                  value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g,'').slice(0,10))} required maxLength={10} />
              </div>
            </div>
          </div>
          <div>
            <label className="section-label block mb-1.5">Email</label>
            <input className="input-base" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div>
            <label className="section-label block mb-1.5">Password</label>
            <input className="input-base" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required minLength={8} />
          </div>
          <div>
            <label className="section-label block mb-1.5">Primary Broker</label>
            <select className="select-base" value={form.broker} onChange={e => set('broker', e.target.value)}>
              {BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary btn btn-lg mt-1 disabled:opacity-60">
            {loading ? 'Creating account…' : 'Continue →'}
          </button>
          <div className="divider"><span className="text-xs text-textMid">or</span></div>
          <GoogleOAuthButton label="Sign up with Google" />
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyEmail} className="space-y-4 animate-fade-up">
          <div className="bg-surface2 rounded-xl p-4 text-center border border-border">
            <div className="text-2xl mb-2">📧</div>
            <p className="text-sm text-textMid">OTP sent to</p>
            <p className="font-semibold text-white">{form.email}</p>
          </div>
          <OtpInput label="Enter Email OTP" value={emailOtp} onChange={setEmailOtp} />
          <button type="submit" disabled={loading || emailOtp.length < 6} className="btn-primary btn btn-lg disabled:opacity-60">
            {loading ? 'Verifying…' : 'Verify Email →'}
          </button>
          <button type="button" onClick={async () => { await authAPI.sendEmailOtp(form.email); toast.success('OTP resent') }}
            className="w-full text-xs text-accent hover:underline py-1">
            Resend OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleVerifyMobile} className="space-y-4 animate-fade-up">
          <div className="bg-surface2 rounded-xl p-4 text-center border border-border">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-sm text-textMid">SMS sent to</p>
            <p className="font-semibold text-white">+91 {form.mobile}</p>
          </div>
          <OtpInput label="Enter Mobile OTP" value={mobileOtp} onChange={setMobileOtp} />
          <button type="submit" disabled={loading || mobileOtp.length < 6} className="btn-primary btn btn-lg disabled:opacity-60">
            {loading ? 'Creating account…' : 'Verify & Open Dashboard →'}
          </button>
          <button type="button" onClick={async () => { await authAPI.sendMobileOtp(form.mobile,'MOBILE_VERIFY'); toast.success('OTP resent') }}
            className="w-full text-xs text-accent hover:underline py-1">
            Resend OTP
          </button>
        </form>
      )}

      <p className="text-center text-xs text-textMid mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-accent font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
