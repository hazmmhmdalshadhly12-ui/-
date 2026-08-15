import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../../lib/supabaseClient'
import { UserPlus, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    parentPhone: '',
    grade: 'first_secondary',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين')
      return
    }
    if (form.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setLoading(true)
    try {
      await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone,
        parentPhone: form.parentPhone,
        grade: form.grade,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message === 'User already registered' ? 'هذا البريد مسجل بالفعل' : err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-vision-success/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-vision-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">تم التسجيل بنجاح!</h1>
          <p className="text-vision-textMuted mb-6">
            تم إرسال رابط التفعيل إلى بريدك الإلكتروني. فعل حسابك وسجل الدخول.
          </p>
          <Link to="/login" className="vision-btn-primary inline-flex">
            الذهاب لتسجيل الدخول
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vision-primary to-vision-accent flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
          <p className="text-vision-textMuted text-sm mt-2">انضم لـ Vision Academy وابدأ رحلتك التعليمية</p>
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
              <label className="vision-label">الاسم الكامل *</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="vision-input"
                placeholder="محمد أحمد"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="vision-label">رقم الموبايل *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="vision-input"
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="vision-label">رقم ولي الأمر</label>
                <input
                  name="parentPhone"
                  value={form.parentPhone}
                  onChange={handleChange}
                  className="vision-input"
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="vision-label">الصف الدراسي *</label>
              <select
                name="grade"
                value={form.grade}
                onChange={handleChange}
                className="vision-input"
              >
                <option value="first_secondary">الصف الأول الثانوي</option>
                <option value="second_secondary">الصف الثاني الثانوي</option>
              </select>
            </div>

            <div>
              <label className="vision-label">البريد الإلكتروني *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="vision-input"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="vision-label">كلمة المرور *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="vision-input pl-10"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-vision-textMuted hover:text-vision-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="vision-label">تأكيد كلمة المرور *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="vision-input"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="vision-btn-primary w-full mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  إنشاء الحساب
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-vision-textMuted text-sm">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-vision-primary hover:text-vision-accent font-medium">
                سجل دخولك
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}