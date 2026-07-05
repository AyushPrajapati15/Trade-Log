import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import { useGuestStore } from '../../store/guestStore'
import GoogleOAuthButton from './GoogleOAuthButton'
import OtpInput from './OtpInput'
import toast from 'react-hot-toast'

export default function LoginForm() {
  const [mode, setMode] = useState('email') // email | mobile
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const { stopGuest } = useGuestStore()
  const navigate = useNavigate()

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.login(email, password)
      setAuth(data); stopGuest()
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally { setLoading(false) }
  }

  const handleSendMobileOtp = async () => {
    if (!mobile || mobile.length < 10) { toast.error('Enter a valid mobile number'); return }
    setLoading(true)
    try {
      await authAPI.sendMobileOtp(mobile, 'LOGIN')
      setOtpSent(true)
      toast.success('OTP sent to +91 ' + mobile)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally { setLoading(false) }
  }

  const handleMobileLogin = async (e) => {
    e.preventDefault()
    if (otp.length < 6) { toast.error('Enter 6-digit OTP'); return }
    setLoading(true)
    try {
      const { data } = await authAPI.loginMobile(mobile, otp)
      setAuth(data); stopGuest()
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex bg-surface2 rounded-lg p-1 gap-1">
        {[['email', 'Email'], ['mobile', 'Mobile OTP']].map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setOtpSent(false); setOtp('') }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === m ? 'bg-surface text-white shadow' : 'text-textMid hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'email' ? (
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <label className="section-label block mb-1.5">Email</label>
            <input className="input-base" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="section-label block mb-1.5">Password</label>
            <input className="input-base" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary btn btn-lg mt-1 disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMobileLogin} className="space-y-3">
          <div>
            <label className="section-label block mb-1.5">Mobile Number</label>
            <div className="flex gap-2">
              <div className="bg-surface2 border border-border rounded-lg px-3 py-2.5 text-sm text-textMid flex-shrink-0">+91</div>
              <input
                className="input-base flex-1"
                type="tel"
                placeholder="9876543210"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
              />
              {!otpSent && (
                <button type="button" onClick={handleSendMobileOtp} disabled={loading}
                  className="btn-ghost btn btn-md flex-shrink-0 text-xs disabled:opacity-60">
                  {loading ? '…' : 'Send OTP'}
                </button>
              )}
            </div>
          </div>
          {otpSent && (
            <div className="animate-fade-up">
              <OtpInput label="Enter OTP" value={otp} onChange={setOtp} />
              <button type="button" onClick={handleSendMobileOtp} className="text-xs text-accent mt-2 hover:underline">
                Resend OTP
              </button>
            </div>
          )}
          {otpSent && (
            <button type="submit" disabled={loading || otp.length < 6} className="btn-primary btn btn-lg disabled:opacity-60">
              {loading ? 'Verifying…' : 'Verify & Sign In'}
            </button>
          )}
        </form>
      )}

      <div className="divider"><span className="text-xs text-textMid">or</span></div>
      <GoogleOAuthButton />

      <p className="text-center text-xs text-textMid">
        No account?{' '}
        <Link to="/signup" className="text-accent font-semibold hover:underline">Create one free →</Link>
      </p>
    </div>
  )
}
