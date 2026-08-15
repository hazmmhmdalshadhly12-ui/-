import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Edit2, Trash2, Loader2, X, Save, GripVertical, ExternalLink } from 'lucide-react'

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', grade: 'first_secondary', video_url: '', order_index: 0 })

  useEffect(() => { fetchCourses() }, [])

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('order_index')
    setCourses(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { ...form, order_index: parseInt(form.order_index) }
    if (editing) {
      await supabase.from('courses').update(data).eq('id', editing.id)
    } else {
      await supabase.from('courses').insert([data])
    }
    setShowForm(false)
    setEditing(null)
    setForm({ title: '', description: '', grade: 'first_secondary', video_url: '', order_index: 0 })
    fetchCourses()
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return
    await supabase.from('courses').delete().eq('id', id)
    fetchCourses()
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">إدارة الكورسات</h1>
          <p className="text-vision-textMuted text-sm mt-1">إضافة وتعديل فيديوهات الكورسات</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="vision-btn-primary">
          <Plus className="w-4 h-4" /> كورس جديد
        </button>
      </div>

      <div className="space-y-3">
        {courses.map(course => (
          <div key={course.id} className="vision-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="w-8 h-8 rounded-lg bg-vision-surfaceLight flex items-center justify-center text-sm font-bold text-vision-textMuted">
                {course.order_index}
              </span>
              <div>
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-vision-textMuted text-sm">{course.description}</p>
                {course.video_url && (
                  <a href={course.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-vision-primary hover:text-vision-accent flex items-center gap-1 mt-1">
                    <ExternalLink className="w-3 h-3" /> {course.video_url}
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs bg-vision-surfaceLight text-vision-textMuted">
                {course.grade === 'first_secondary' ? 'الأول' : 'الثاني'}
              </span>
              <button onClick={() => { setEditing(course); setForm({ ...course }); setShowForm(true); }} className="p-2 rounded-lg hover:bg-vision-surfaceLight">
                <Edit2 className="w-4 h-4 text-vision-primary" />
              </button>
              <button onClick={() => handleDelete(course.id)} className="p-2 rounded-lg hover:bg-vision-danger/10">
                <Trash2 className="w-4 h-4 text-vision-danger" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20 text-vision-textMuted">لا توجد كورسات</div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-vision-surface border border-vision-surfaceLight rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? 'تعديل كورس' : 'كورس جديد'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-vision-surfaceLight"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="عنوان الكورس" required className="vision-input" />
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="الوصف" rows={2} className="vision-input resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className="vision-input">
                  <option value="first_secondary">الأول الثانوي</option>
                  <option value="second_secondary">الثاني الثانوي</option>
                </select>
                <input type="number" value={form.order_index} onChange={e => setForm(p => ({ ...p, order_index: e.target.value }))} placeholder="الترتيب" className="vision-input" />
              </div>
              <input value={form.video_url} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))} placeholder="رابط الفيديو" className="vision-input" dir="ltr" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border border-vision-surfaceLight text-sm font-medium hover:bg-vision-surfaceLight">إلغاء</button>
                <button type="submit" className="flex-1 vision-btn-primary"><Save className="w-4 h-4" /> حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}