import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth, signOut } from '../lib/supabaseClient'
import { Menu, X, Eye, LogOut, User, LayoutDashboard, Shield } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const isAdmin = user?.profile?.role === 'admin'
  const isStudent = user?.profile?.role === 'student'

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/courses', label: 'الكورسات' },
    { to: '/contact', label: 'التواصل' },
  ]

  if (isStudent) {
    navLinks.push(
      { to: '/student/dashboard', label: 'لوحة الطالب' },
      { to: '/student/exams', label: 'الامتحانات' },
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-vision-dark/80 backdrop-blur-xl border-b border-vision-surfaceLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-vision-primary to-vision-accent flex items-center justify-center group-hover:shadow-lg group-hover:shadow-vision-primary/30 transition-all">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">Vision Academy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-vision-accent bg-vision-primary/10'
                    : 'text-vision-textMuted hover:text-vision-text hover:bg-vision-surfaceLight'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-vision-warning bg-vision-warning/10 hover:bg-vision-warning/20 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    لوحة التحكم
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-vision-surfaceLight">
                  <User className="w-4 h-4 text-vision-primary" />
                  <span className="text-sm font-medium">{user.profile?.full_name || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-vision-danger hover:bg-vision-danger/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="vision-btn-outline text-sm py-2 px-4">
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="vision-btn-primary text-sm py-2 px-4">
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-vision-textMuted hover:text-vision-text hover:bg-vision-surfaceLight"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-vision-surfaceLight bg-vision-dark/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-vision-accent bg-vision-primary/10'
                    : 'text-vision-textMuted hover:text-vision-text hover:bg-vision-surfaceLight'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-vision-warning bg-vision-warning/10"
                  >
                    <Shield className="w-4 h-4" />
                    لوحة التحكم
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-vision-danger hover:bg-vision-danger/10"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 vision-btn-outline text-sm py-2">
                  دخول
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 vision-btn-primary text-sm py-2">
                  حساب جديد
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}