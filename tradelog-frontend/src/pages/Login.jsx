import LoginForm from '../components/auth/LoginForm'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useGuestStore } from '../store/guestStore'

export default function Login() {
  const { isAuthenticated } = useAuthStore()
  const { initGuest, isGuest } = useGuestStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) { navigate('/dashboard', { replace: true }); return }
    if (!isGuest) initGuest()
  }, [isAuthenticated])

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4">
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />

      <div className="w-full max-w-[400px] animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center font-display font-black text-2xl text-black mx-auto mb-3">T</div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">TradeLog India</h1>
          <p className="text-sm text-textMid mt-1">Your personal trading journal</p>
        </div>

        <div className="card">
          <LoginForm />
        </div>
f
        {/* Guest option */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-textMid hover:text-white transition-colors underline underline-offset-2"
          >
            Continue as guest (5 min preview) →
          </button>
        </div>
      </div>
    </div>
  )
}
