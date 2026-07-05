import SignupForm from '../components/auth/SignupForm'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Signup() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated])

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4 py-10">
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />

      <div className="w-full max-w-[420px] animate-fade-up">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center font-display font-black text-2xl text-black mx-auto mb-3">T</div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">Create Account</h1>
          <p className="text-sm text-textMid mt-1">Start tracking your trades for free</p>
        </div>
        <div className="card">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
