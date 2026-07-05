import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { useGuestStore } from './store/guestStore'

// Layout
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import MobileNav from './components/layout/MobileNav'
import TickerTape from './components/layout/TickerTape'
import GuestBanner from './components/layout/GuestBanner'

// Auth guards
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/admin/AdminRoute'
import AdminLayout from './components/admin/AdminLayout'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import LogTrade from './pages/LogTrade'
import Analytics from './pages/Analytics'
import Import from './pages/Import'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTrades from './pages/admin/AdminTrades'
import AdminAnalytics from './pages/admin/AdminAnalytics'

// Sidebar width constants
const SIDEBAR_W = 'md:pl-[200px]'

function AppLayout({ children }) {
  const { isAuthenticated } = useAuthStore()
  const { isGuest } = useGuestStore()

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Sidebar />
      <div className={`flex flex-col flex-1 ${SIDEBAR_W} overflow-hidden`}>
        {/* Guest countdown banner */}
        {!isAuthenticated && isGuest && <GuestBanner />}

        <Topbar />
        <TickerTape />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <MobileNav />
      </div>
    </div>
  )
}

export default function App() {
  const { isAuthenticated, loadProfile } = useAuthStore()
  const { initGuest, isGuest, stopGuest } = useGuestStore()
  const location = useLocation()

  // On mount: check for physical token layout directly to avoid Zustand persist delay bugs
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const publicPaths = ['/login', '/signup']
    const isPublicPath = publicPaths.includes(location.pathname)

    if (token) {
      // Prioritize loading the authenticated user context profile if a token exists
      loadProfile()
    } else if (!isPublicPath && !isGuest) {
      // Initialize guest mode ONLY when no token traces exist in the system
      initGuest()
    }
  }, [])

  // Stop guest timer when user successfully authenticates
  useEffect(() => {
    if (isAuthenticated && isGuest) stopGuest()
  }, [isAuthenticated, isGuest])

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* OAuth callback — backend handles redirect, this is a fallback */}
      <Route path="/oauth2/callback" element={<Navigate to="/dashboard" replace />} />

      {/* Guest-accessible pages */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowGuest>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/log" element={
        <ProtectedRoute allowGuest>
          <AppLayout><LogTrade /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Authenticated-only pages */}
      <Route path="/journal" element={
        <ProtectedRoute>
          <AppLayout><Journal /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <AppLayout><Analytics /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/import" element={
        <ProtectedRoute>
          <AppLayout><Import /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Admin pages */}
      <Route path="/admin" element={
        <AdminRoute>
          <AppLayout>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </AppLayout>
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AppLayout>
            <AdminLayout><AdminUsers /></AdminLayout>
          </AppLayout>
        </AdminRoute>
      } />
      <Route path="/admin/trades" element={
        <AdminRoute>
          <AppLayout>
            <AdminLayout><AdminTrades /></AdminLayout>
          </AppLayout>
        </AdminRoute>
      } />
      <Route path="/admin/analytics" element={
        <AdminRoute>
          <AppLayout>
            <AdminLayout><AdminAnalytics /></AdminLayout>
          </AppLayout>
        </AdminRoute>
      } />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
