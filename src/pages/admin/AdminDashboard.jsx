import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { Users, BookOpen, ClipboardList, Calendar, Trophy, TrendingUp, Loader2, ChevronLeft } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, exams: 0, bookings: 0, competitions: 0, submissions: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [students, courses, exams, bookings, competitions, submissions] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact' }).eq('role', 'student'),
      supabase.from('courses').select('*', { count: 'exact' }),
      supabase.from('exams').select('*', { count: 'exact' }),
      supabase.from('bookings').select('*', { count: 'exact' }),
      supabase.from('competitions').select('*', { count: 'exact' }),
      supabase.from('exam_submissions').select('*', { count: 'exact' }),
    ])

    setStats({
      students: students.count || 0,
      courses: courses.count || 0,
      exams: exams.count || 0,
      bookings: bookings.count || 0,
      competitions: competitions.count || 0,
      submissions: submissions.count || 0,
    })
    setLoading(false)
  }

  const quickLinks = [
    { to: '/admin/exams', label: 'إدارة الامتحانات', icon: ClipboardList, color: 'text-vision-primary', bg: 'bg-vision-primary/10' },
    { to: '/admin/grades', label: 'مراجعة الدرجات', icon: TrendingUp, color: 'text-vision-success', bg: 'bg-vision-success/10' },
    { to: '/admin/courses', label: 'إدارة الكورسات', icon: BookOpen, color: 'text-vision-accent', bg: 'bg-vision-accent/10' },
    { to: '/admin/bookings', label: 'الحجوزات', icon: Calendar, color: 'text-vision-warning', bg: 'bg-vision-warning/10' },
    { to: '/admin/competitions', label: 'المسابقات', icon: Trophy, color: 'text-vision-danger', bg: 'bg-vision-danger/10' },
    { to: '/admin/users', label: 'الطلاب', icon: Users, color: 'text-vision-primary', bg: 'bg-vision-primary/10' },
  ]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">لوحة تحكم المستر</h1>
        <p className="text-vision-textMuted text-sm mt-1">نظرة عامة على الأكاديمية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Users, label: 'طلاب مسجلون', value: stats.students, color: 'text-vision-primary', bg: 'bg-vision-primary/10' },
          { icon: BookOpen, label: 'كورسات', value: stats.courses, color: 'text-vision-accent', bg: 'bg-vision-accent/10' },
          { icon: ClipboardList, label: 'امتحانات', value: stats.exams, color: 'text-vision-warning', bg: 'bg-vision-warning/10' },
          { icon: Calendar, label: 'حجوزات', value: stats.bookings, color: 'text-vision-success', bg: 'bg-vision-success/10' },
          { icon: Trophy, label: 'مسابقات', value: stats.competitions, color: 'text-vision-danger', bg: 'bg-vision-danger/10' },
          { icon: TrendingUp, label: 'تسليمات', value: stats.submissions, color: 'text-vision-primary', bg: 'bg-vision-primary/10' },
        ].map((stat, i) => (
          <div key={i} className="vision-card">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-vision-textMuted text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-bold mb-4">وصول سريع</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link, i) => (
          <Link
            key={i}
            to={link.to}
            className="vision-card flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${link.bg} flex items-center justify-center`}>
                <link.icon className={`w-5 h-5 ${link.color}`} />
              </div>
              <span className="font-medium">{link.label}</span>
            </div>
            <ChevronLeft className="w-5 h-5 text-vision-textMuted group-hover:text-vision-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}