import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
import { ClipboardList, Clock, Calendar, Lock, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function StudentExams() {
  const { user } = useAuth()
  const [exams, setExams] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchExams()
  }, [user])

  const fetchExams = async () => {
    const grade = user.profile?.grade

    const { data: examsData } = await supabase
      .from('exams')
      .select('*')
      .eq('grade', grade)
      .eq('is_published', true)
      .order('start_at', { ascending: false })

    const { data: subsData } = await supabase
      .from('exam_submissions')
      .select('*')
      .eq('student_id', user.id)

    setExams(examsData || [])
    setSubmissions(subsData || [])
    setLoading(false)
  }

  const getExamStatus = (exam) => {
    const now = new Date()
    const start = new Date(exam.start_at)
    const end = new Date(exam.end_at)
    const submission = submissions.find(s => s.exam_id === exam.id)

    if (submission) return { status: 'submitted', label: 'تم التسليم', color: 'text-vision-success', bg: 'bg-vision-success/10', icon: CheckCircle }
    if (now < start) return { status: 'upcoming', label: 'لم يبدأ بعد', color: 'text-vision-warning', bg: 'bg-vision-warning/10', icon: Calendar }
    if (now > end) return { status: 'ended', label: 'انتهى', color: 'text-vision-danger', bg: 'bg-vision-danger/10', icon: XCircle }
    return { status: 'available', label: 'متاح الآن', color: 'text-vision-primary', bg: 'bg-vision-primary/10', icon: ClipboardList }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">الامتحانات</h1>
        <p className="text-vision-textMuted text-sm mt-1">قائمة الامتحانات المتاحة لصفك</p>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-vision-surfaceLight mx-auto mb-4" />
          <p className="text-vision-textMuted">لا توجد امتحانات متاحة حالياً</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map(exam => {
            const status = getExamStatus(exam)
            const StatusIcon = status.icon

            return (
              <div key={exam.id} className="vision-card flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{exam.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-vision-textMuted text-sm mb-3">{exam.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-vision-textMuted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exam.duration_minutes} دقيقة
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      من {new Date(exam.start_at).toLocaleDateString('ar-EG')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      إلى {new Date(exam.end_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {status.status === 'available' ? (
                    <Link to={`/student/exams/${exam.id}`} className="vision-btn-primary">
                      <ClipboardList className="w-4 h-4" />
                      بدء الامتحان
                    </Link>
                  ) : status.status === 'submitted' ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vision-success/10 text-vision-success text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      تم التسليم
                    </div>
                  ) : status.status === 'ended' ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vision-danger/10 text-vision-danger text-sm font-medium">
                      <Lock className="w-4 h-4" />
                      انتهى
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-vision-warning/10 text-vision-warning text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      قريباً
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}