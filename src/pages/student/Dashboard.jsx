import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
import { BookOpen, ClipboardList, Calendar, Trophy, TrendingUp, Clock, AlertCircle, Loader2, ChevronLeft } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ exams: 0, submissions: 0, bookings: 0, competitions: 0 })
  const [recentExams, setRecentExams] = useState([])
  const [recentGrades, setRecentGrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    const grade = user.profile?.grade

    // Available exams
    const { data: exams } = await supabase
      .from('exams')
      .select('*')
      .eq('grade', grade)
      .eq('is_published', true)
      .gte('end_at', new Date().toISOString())
      .order('start_at', { ascending: true })
      .limit(5)

    // Submissions
    const { data: submissions } = await supabase
      .from('exam_submissions')
      .select('*, exams(title)')
      .eq('student_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(5)

    // Bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    // Competitions
    const { data: competitions } = await supabase
      .from('competitions')
      .select('*')
      .eq('grade', grade)
      .gte('deadline', new Date().toISOString())
      .limit(3)

    setStats({
      exams: exams?.length || 0,
      submissions: submissions?.length || 0,
      bookings: bookings?.length || 0,
      competitions: competitions?.length || 0,
    })
    setRecentExams(exams || [])
    setRecentGrades(submissions?.filter(s => s.grade_released && s.score !== null) || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  const statCards = [
    { icon: ClipboardList, label: 'امتحانات متاحة', value: stats.exams, color: 'text-vision-primary', bg: 'bg-vision-primary/10' },
    { icon: TrendingUp, label: 'امتحانات محلولة', value: stats.submissions, color: 'text-vision-success', bg: 'bg-vision-success/10' },
    { icon: Calendar, label: 'حجوزات', value: stats.bookings, color: 'text-vision-warning', bg: 'bg-vision-warning/10' },
    { icon: Trophy, label: 'مسابقات نشطة', value: stats.competitions, color: 'text-vision-accent', bg: 'bg-vision-accent/10' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">أهلاً، {user?.profile?.full_name || 'طالبنا العزيز'} 👋</h1>
        <p className="text-vision-textMuted text-sm mt-1">إليك ملخص نشاطك في Vision Academy</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="vision-card">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-vision-textMuted text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Exams */}
        <div className="vision-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-vision-primary" />
              امتحانات متاحة
            </h2>
            <Link to="/student/exams" className="text-sm text-vision-primary hover:text-vision-accent flex items-center gap-1">
              الكل <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          {recentExams.length > 0 ? (
            <div className="space-y-3">
              {recentExams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-vision-darker border border-vision-surfaceLight">
                  <div>
                    <p className="font-medium text-sm">{exam.title}</p>
                    <p className="text-vision-textMuted text-xs flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {exam.duration_minutes} دقيقة
                    </p>
                  </div>
                  <Link to={`/student/exams/${exam.id}`} className="text-xs vision-btn-primary py-1.5 px-3">
                    بدء
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-vision-textMuted text-sm">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              لا توجد امتحانات متاحة حالياً
            </div>
          )}
        </div>

        {/* Recent Grades */}
        <div className="vision-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-vision-success" />
              آخر الدرجات
            </h2>
            <Link to="/student/grades" className="text-sm text-vision-primary hover:text-vision-accent flex items-center gap-1">
              الكل <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          {recentGrades.length > 0 ? (
            <div className="space-y-3">
              {recentGrades.map(grade => (
                <div key={grade.id} className="flex items-center justify-between p-3 rounded-lg bg-vision-darker border border-vision-surfaceLight">
                  <div>
                    <p className="font-medium text-sm">{grade.exams?.title || 'امتحان'}</p>
                    <p className="text-vision-textMuted text-xs">{new Date(grade.submitted_at).toLocaleDateString('ar-EG')}</p>
                  </div>
                  <div className="text-lg font-bold text-vision-success">{grade.score} / 100</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-vision-textMuted text-sm">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              لا توجد درجات منشورة حالياً
            </div>
          )}
        </div>
      </div>
    </div>
  )
}