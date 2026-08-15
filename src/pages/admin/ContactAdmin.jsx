import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, Edit2, Trash2, Loader2, X, Save, Link2 } from 'lucide-react'

export default function ContactAdmin() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ platform: 'whatsapp', label: '', value: '' })

  useEffect(() => { fetchLinks() }, [])

  const fetchLinks = async () => {
    const { data } = await supabase.from('contact_links').select('*').order('id')
    setLinks(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await supabase.from('contact_links').update(form).eq('id', editing.id)
    } else {
      await supabase.from('contact_links').insert([form])
    }
    setShowForm(false)
    setEditing(null)
    setForm({ platform: 'whatsapp', label: '', value: '' })
    fetchLinks()
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return
    await supabase.from('contact_links').delete().eq('id', id)
    fetchLinks()
  }

  const platforms = ['whatsapp', 'phone', 'facebook', 'youtube', 'telegram', 'instagram', 'website']

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">روابط التواصل</h1>
          <p className="text-vision-textMuted text-sm mt-1">إدارة أرقام التواصل وروابط السوشيال ميديا</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="vision-btn-primary">
          <Plus className="w-4 h-4" /> إضافة رابط
        </button>
      </div>

      <div className="space-y-3">
        {links.map(link => (
          <div key={link.id} className="vision-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-vision-primary/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-vision-primary" />
              </div>
              <div>
                <h3 className="font-bold">{link.label}</h3>
                <p className="text-vision-textMuted text-sm">{link.platform} — {link.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(link); setForm({ ...link }); setShowForm(true); }} className="p-2 rounded-lg hover:bg-vision-surfaceLight">
                <Edit2 className="w-4 h-4 text-vision-primary" />
              </button>
              <button onClick={() => handleDelete(link.id)} className="p-2 rounded-lg hover:bg-vision-danger/10">
                <Trash2 className="w-4 h-4 text-vision-danger" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-20 text-vision-textMuted">لا توجد روابط</div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-vision-surface border border-vision-surfaceLight rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? 'تعديل رابط' : 'رابط جديد'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-vision-surfaceLight"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} className="vision-input">
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="الاسم المعروض (مثال: واتساب)" required className="vision-input" />
              <input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="الرقم أو الرابط" required className="vision-input" dir="ltr" />
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