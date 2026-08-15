import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, Save, GripVertical } from 'lucide-react'

export default function ExamsAdmin() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', grade: 'first_secondary',
    duration_minutes: 30, start_at: '', end_at: '', is_published: false,
    questions: []
  })

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    const { data } = await supabase.from('exams').select('*').order('created_at', { ascending: false })
    setExams(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const examData = {
      title: form.title,
      description: form.description,
      grade: form.grade,
      duration_minutes: parseInt(form.duration_minutes),
      start_at: form.start_at,
      end_at: form.end_at,
      is_published: form.is_published,
    }

    if (editingExam) {
      await supabase.from('exams').update(examData).eq('id', editingExam.id)
    } else {
      const { data } = await supabase.from('exams').insert([examData]).select()
      if (data?.[0] && form.questions.length > 0) {
        await supabase.from('exam_questions').insert(
          form.questions.map(q => ({ ...q, exam_id: data[0].id }))
        )
      }
    }

    setShowForm(false)
    setEditingExam(null)
    setForm({ title: '', description: '', grade: 'first_secondary', duration_minutes: 30, start_at: '', end_at: '', is_published: false, questions: [] })
    fetchExams()
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الامتحان؟')) return
    await supabase.from('exams').delete().eq('id', id)
    fetchExams()
  }

  const addQuestion = () => {
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question_text: '', type: 'mcq', options: ['', '', '', ''], correct_answer: '', points: 1
      }]
    }))
  }

  const updateQuestion = (i, field, value) => {
    setForm(prev => {
      const qs = [...prev.questions]
      qs[i] = { ...qs[i], [field]: value }
      return { ...prev, questions: qs }
    })
  }

  const updateOption = (qi, oi, value) => {
    setForm(prev => {
      const qs = [...prev.questions]
      qs[qi].options[oi] = value
      return { ...prev, questions: qs }
    })
  }

  const removeQuestion = (i) => {
    setForm(prev => ({ ...prev, questions: prev.questions.filter((_, idx) => idx !== i) }))
  }

  const togglePublish = async (id, current) => {
    await supabase.from('exams').update({ is_published: !current }).eq('id', id)
    fetchExams()
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">إدارة الامتحانات</h1>
          <p className="text-vision-textMuted text-sm mt-1">إضافة وتعديل وحذف الامتحانات</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingExam(null); }}
          className="vision-btn-primary"
        >
          <Plus className="w-4 h-4" />
          امتحان جديد
        </button>
      </div>

      {/* Exams List */}
      <div className="space-y-3">
        {exams.map(exam => (
          <div key={exam.id} className="vision-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold">{exam.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  exam.is_published ? 'bg-vision-success/10 text-vision-success' : 'bg-vision-warning/10 text-vision-warning'
                }`}>
                  {exam.is_published ? 'منشور' : 'مسودة'}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-vision-surfaceLight text-vision-textMuted">
                  {exam.grade === 'first_secondary' ? 'الأول' : 'الثاني'}
                </span>
              </div>
              <p className="text-vision-textMuted text-sm">{exam.description}</p>
              <p className="text-vision-textMuted text-xs mt-1">
                {exam.duration_minutes} دقيقة | {new Date(exam.start_at).toLocaleDateString('ar-EG')} - {new Date(exam.end_at).toLocaleDateString('ar-EG')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePublish(exam.id, exam.is_published)}
                className="p-2 rounded-lg hover:bg-vision-surfaceLight transition-colors"
                title={exam.is_published ? 'إخفاء' : 'نشر'}
              >
                {exam.is_published ? <EyeOff className="w-4 h-4 text-vision-warning" /> : <Eye className="w-4 h-4 text-vision-success" />}
              </button>
              <button
                onClick={() => { setEditingExam(exam); setForm({ ...exam, questions: [] }); setShowForm(true); }}
                className="p-2 rounded-lg hover:bg-vision-surfaceLight transition-colors"
              >
                <Edit2 className="w-4 h-4 text-vision-primary" />
              </button>
              <button
                onClick={() => handleDelete(exam.id)}
                className="p-2 rounded-lg hover:bg-vision-danger/10 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-vision-danger" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-20">
          <ClipboardList className="w-16 h-16 text-vision-surfaceLight mx-auto mb-4" />
          <p className="text-vision-textMuted">لا توجد امتحانات</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-vision-surface border border-vision-surfaceLight rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingExam ? 'تعديل امتحان' : 'امتحان جديد'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-vision-surfaceLight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="vision-label">العنوان *</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required className="vision-input" />
                </div>
                <div>
                  <label className="vision-label">الصف</label>
                  <select value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className="vision-input">
                    <option value="first_secondary">الأول الثانوي</option>
                    <option value="second_secondary">الثاني الثانوي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="vision-label">الوصف</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="vision-input resize-none" />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="vision-label">المدة (دقيقة)</label>
                  <input type="number" value={form.duration_minutes} onChange={e => setForm(p => ({ ...p, duration_minutes: e.target.value }))} min="1" className="vision-input" />
                </div>
                <div>
                  <label className="vision-label">تاريخ البداية</label>
                  <input type="datetime-local" value={form.start_at} onChange={e => setForm(p => ({ ...p, start_at: e.target.value }))} required className="vision-input" dir="ltr" />
                </div>
                <div>
                  <label className="vision-label">تاريخ النهاية</label>
                  <input type="datetime-local" value={form.end_at} onChange={e => setForm(p => ({ ...p, end_at: e.target.value }))} required className="vision-input" dir="ltr" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} className="w-4 h-4 text-vision-primary rounded" />
                <span className="text-sm">نشر الامتحان فوراً</span>
              </label>

              {/* Questions (only for new exams) */}
              {!editingExam && (
                <div className="border-t border-vision-surfaceLight pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">الأسئلة ({form.questions.length})</h3>
                    <button type="button" onClick={addQuestion} className="text-sm text-vision-primary hover:text-vision-accent flex items-center gap-1">
                      <Plus className="w-4 h-4" /> إضافة سؤال
                    </button>
                  </div>

                  <div className="space-y-4">
                    {form.questions.map((q, qi) => (
                      <div key={qi} className="p-4 rounded-xl bg-vision-darker border border-vision-surfaceLight">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-vision-textMuted">سؤال {qi + 1}</span>
                          <button type="button" onClick={() => removeQuestion(qi)} className="text-vision-danger hover:text-vision-danger/80">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            value={q.question_text}
                            onChange={e => updateQuestion(qi, 'question_text', e.target.value)}
                            placeholder="نص السؤال"
                            className="vision-input"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <select value={q.type} onChange={e => updateQuestion(qi, 'type', e.target.value)} className="vision-input">
                              <option value="mcq">اختيار من متعدد</option>
                              <option value="true_false">صح/خطأ</option>
                              <option value="short_answer">سؤال مقالي</option>
                            </select>
                            <input type="number" value={q.points} onChange={e => updateQuestion(qi, 'points', parseInt(e.target.value))} placeholder="الدرجة" min="1" className="vision-input" />
                          </div>
                          {q.type === 'mcq' && (
                            <div className="grid grid-cols-2 gap-2">
                              {q.options.map((opt, oi) => (
                                <input key={oi} value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`الاختيار ${oi + 1}`} className="vision-input text-sm" />
                              ))}
                            </div>
                          )}
                          <input
                            value={q.correct_answer}
                            onChange={e => updateQuestion(qi, 'correct_answer', e.target.value)}
                            placeholder="الإجابة الصحيحة"
                            className="vision-input text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border border-vision-surfaceLight text-sm font-medium hover:bg-vision-surfaceLight">
                  إلغاء
                </button>
                <button type="submit" className="flex-1 vision-btn-primary">
                  <Save className="w-4 h-4" />
                  {editingExam ? 'حفظ التعديلات' : 'إنشاء الامتحان'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}