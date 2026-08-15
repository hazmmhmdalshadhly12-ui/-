import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
import { TrendingUp, AlertCircle, Loader2, Award } from 'lucide-react'

export default function StudentGrades() {
  const { user } = useAuth()
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchGrades()
  }, [user])

  const fetchGrades = async () => {
    const { data, error } = await supabase
      .from('exam_submissions')
      .select('*, exams(title, description)')
      .eq('student_id', user.id)
      .order('submitted_at', { ascending: false })

    if (!error) setGrades(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  const releasedGrades = grades.filter(g => g.grade_released)
  const pendingGrades = grades.filter(g => !g.grade_released)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">درجاتي</h1>
        <p className="text-vision-textMuted text-sm mt-1">تتبع نتائج امتحاناتك وأدائك</p>
      </div>

      {/* Released Grades */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-vision-success" />
          الدرجات المنشورة
        </h2>
        {releasedGrades.length > 0 ? (
          <div className="space-y-3">
            {releasedGrades.map(grade => (
              <div key={grade.id} className="vision-card flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{grade.exams?.title || 'امتحان'}</h3>
                  <p className="text-vision-textMuted text-sm">{grade.exams?.description}</p>
                  <p className="text-vision-textMuted text-xs mt-1">
                    تم التسليم: {new Date(grade.submitted_at).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-black ${
                    (grade.score || 0) >= 80 ? 'text-vision-success' : 
                    (grade.score || 0) >= 60 ? 'text-vision-warning' : 'text-vision-danger'
                  }`}>
                    {grade.score !== null ? `${Math.round(grade.score)}%` : '—'}
                  </div>
                  <div className="text-xs text-vision-textMuted">الدرجة</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="vision-card text-center py-12">
            <Award className="w-12 h-12 text-vision-surfaceLight mx-auto mb-3" />
            <p className="text-vision-textMuted">لا توجد درجات منشورة بعد</p>
          </div>
        )}
      </div>

      {/* Pending Grades */}
      {pendingGrades.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-vision-warning" />
            قيد المراجعة
          </h2>
          <div className="space-y-3">
            {pendingGrades.map(grade => (
              <div key={grade.id} className="vision-card opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{grade.exams?.title || 'امتحان'}</h3>
                    <p className="text-vision-textMuted text-xs mt-1">
                      تم التسليم: {new Date(grade.submitted_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-vision-warning/10 text-vision-warning text-xs font-medium">
                    قيد المراجعة
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}