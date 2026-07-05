import { useNavigate } from 'react-router-dom'

export default function ExpiredModal() {
  const navigate = useNavigate()
  return (
    <div className="modal-overlay">
      <div className="card max-w-sm w-full mx-4 text-center animate-fade-up">
        <div className="w-14 h-14 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center mx-auto mb-4 text-2xl">⏱</div>
        <h2 className="font-display font-bold text-xl mb-2">Free trial ended</h2>
        <p className="text-sm text-textMid mb-6 leading-relaxed">
          Your 5-minute guest session has expired. Create a free account to continue trading and save your data permanently.
        </p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/signup')} className="btn-primary btn btn-lg flex-1">
            Create Free Account
          </button>
          <button onClick={() => navigate('/login')} className="btn-ghost btn btn-md flex-1">
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
