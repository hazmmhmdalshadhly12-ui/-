import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, getCurrentUser } from '../../lib/supabaseClient'
import { Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn({ email, password })
      const user = await getCurrentUser()

      if (user?.profile?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/student/dashboard')
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vision-primary to-vision-accent flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
          <p className="text-vision-textMuted text-sm mt-2">أهلاً بك مجدداً في Vision Academy</p>
        </div>

        <div className="vision-card">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-vision-danger/10 border border-vision-danger/20 text-vision-danger text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="vision-label">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="vision-input"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            <div>
              <label className="vision-label">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="vision-input pl-12"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-vision-textMuted hover:text-vision-text"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="vision-btn-primary w-full"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-vision-textMuted text-sm">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-vision-primary hover:text-vision-accent font-medium">
                سجل الآن
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}