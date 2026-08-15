import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { TrendingUp, Eye, EyeOff, Loader2, Save, CheckCircle } from 'lucide-react'

export default function GradesAdmin() {
  const [exams, setExams] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    const { data } = await supabase.from('exams').select('*').order('created_at', { ascending: false })
    setExams(data || [])
    setLoading(false)
  }

  const fetchSubmissions = async (examId) => {
    setLoading(true)
    const { data } = await supabase
      .from('exam_submissions')
      .select('*, profiles(full_name, grade), exams(title)')
      .eq('exam_id', examId)
      .order('submitted_at', { ascending: false })
    setSubmissions(data || [])
    setSelectedExam(examId)
    setLoading(false)
  }

  const updateScore = async (id, newScore) => {
    await supabase.from('exam_submissions').update({ score: parseFloat(newScore) }).eq('id', id)
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, score: parseFloat(newScore) } : s))
  }

  const toggleRelease = async (id, current) => {
    await supabase.from('exam_submissions').update({ grade_released: !current }).eq('id', id)
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, grade_released: !current } : s))
  }

  const releaseAll = async () => {
    setSaving(true)
    await supabase.from('exam_submissions').update({ grade_released: true }).eq('exam_id', selectedExam)
    fetchSubmissions(selectedExam)
    setSaving(false)
  }

  if (loading && !selectedExam) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">مراجعة الدرجات</h1>
        <p className="text-vision-textMuted text-sm mt-1">تصحيح يدوي ونشر الدرجات للطلاب</p>
      </div>

      {!selectedExam ? (
        <div className="space-y-3">
          {exams.map(exam => (
            <button
              key={exam.id}
              onClick={() => fetchSubmissions(exam.id)}
              className="w-full text-right vision-card flex items-center justify-between hover:border-vision-primary/50"
            >
              <div>
                <h3 className="font-bold">{exam.title}</h3>
                <p className="text-vision-textMuted text-sm">{exam.grade === 'first_secondary' ? 'الأول الثانوي' : 'الثاني الثانوي'}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-vision-primary" />
            </button>
          ))}
          {exams.length === 0 && (
            <div className="text-center py-20 text-vision-textMuted">لا توجد امتحانات</div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setSelectedExam(null)} className="text-sm text-vision-primary hover:text-vision-accent">
              ← العودة للامتحانات
            </button>
            <button onClick={releaseAll} disabled={saving} className="vision-btn-primary text-sm py-2 px-4">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> نشر كل الدرجات</>}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-vision-primary animate-spin" /></div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 text-vision-textMuted">لا توجد تسليمات لهذا الامتحان</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-vision-surfaceLight">
                    <th className="text-right py-3 px-4 text-sm font-medium text-vision-textMuted">الطالب</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-vision-textMuted">الصف</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-vision-textMuted">تاريخ التسليم</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-vision-textMuted">الدرجة (%)</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-vision-textMuted">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id} className="border-b border-vision-surfaceLight/50 hover:bg-vision-surfaceLight/30">
                      <td className="py-3 px-4">{sub.profiles?.full_name || '—'}</td>
                      <td className="py-3 px-4 text-sm text-vision-textMuted">{sub.profiles?.grade === 'first_secondary' ? 'الأول' : 'الثاني'}</td>
                      <td className="py-3 px-4 text-sm text-vision-textMuted">{new Date(sub.submitted_at).toLocaleDateString('ar-EG')}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={sub.score ?? ''}
                          onChange={e => updateScore(sub.id, e.target.value)}
                          className="w-20 vision-input py-1 px-2 text-sm"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleRelease(sub.id, sub.grade_released)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            sub.grade_released
                              ? 'bg-vision-success/10 text-vision-success'
                              : 'bg-vision-warning/10 text-vision-warning'
                          }`}
                        >
                          {sub.grade_released ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {sub.grade_released ? 'منشور' : 'مخفي'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}