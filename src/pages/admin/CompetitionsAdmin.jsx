import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Edit2, Trash2, Loader2, X, Save, Trophy } from 'lucide-react'

export default function CompetitionsAdmin() {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', grade: 'first_secondary', deadline: '', details: '' })

  useEffect(() => { fetchCompetitions() }, [])

  const fetchCompetitions = async () => {
    const { data } = await supabase.from('competitions').select('*').order('deadline')
    setCompetitions(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await supabase.from('competitions').update(form).eq('id', editing.id)
    } else {
      await supabase.from('competitions').insert([form])
    }
    setShowForm(false)
    setEditing(null)
    setForm({ title: '', description: '', grade: 'first_secondary', deadline: '', details: '' })
    fetchCompetitions()
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return
    await supabase.from('competitions').delete().eq('id', id)
    fetchCompetitions()
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
          <h1 className="text-2xl font-bold">المسابقات</h1>
          <p className="text-vision-textMuted text-sm mt-1">إدارة المسابقات والتحديات</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="vision-btn-primary">
          <Plus className="w-4 h-4" /> مسابقة جديدة
        </button>
      </div>

      <div className="space-y-3">
        {competitions.map(comp => (
          <div key={comp.id} className="vision-card flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <Trophy className="w-5 h-5 text-vision-warning" />
                <h3 className="font-bold">{comp.title}</h3>
                <span className="px-2 py-0.5 rounded text-xs bg-vision-surfaceLight text-vision-textMuted">
                  {comp.grade === 'first_secondary' ? 'الأول' : 'الثاني'}
                </span>
              </div>
              <p className="text-vision-textMuted text-sm">{comp.description}</p>
              <p className="text-vision-textMuted text-xs mt-1">الموعد النهائي: {new Date(comp.deadline).toLocaleString('ar-EG')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(comp); setForm({ ...comp }); setShowForm(true); }} className="p-2 rounded-lg hover:bg-vision-surfaceLight">
                <Edit2 className="w-4 h-4 text-vision-primary" />
              </button>
              <button onClick={() => handleDelete(comp.id)} className="p-2 rounded-lg hover:bg-vision-danger/10">
                <Trash2 className="w-4 h-4 text-vision-danger" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {competitions.length === 0 && (
        <div className="text-center py-20 text-vision-textMuted">لا توجد مسابقات</div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-vision-surface border border-vision-surfaceLight rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? 'تعديل مسابقة' : 'مسابقة جديدة'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-vision-surfaceLight"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="عنوان المسابقة" required className="vision-input" />
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="الوصف" rows={2} className="vision-input resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className="vision-input">
                  <option value="first_secondary">الأول الثانوي</option>
                  <option value="second_secondary">الثاني الثانوي</option>
                </select>
                <input type="datetime-local" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} required className="vision-input" dir="ltr" />
              </div>
              <textarea value={form.details} onChange={e => setForm(p => ({ ...p, details: e.target.value }))} placeholder="تفاصيل إضافية" rows={3} className="vision-input resize-none" />
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