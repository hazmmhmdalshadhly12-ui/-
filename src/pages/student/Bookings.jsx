import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
import { Calendar, Clock, AlertCircle, Loader2, CheckCircle, XCircle, Clock3, Send } from 'lucide-react'

export default function StudentBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    requested_datetime: '',
    subject: 'Computer Science',
    notes: '',
  })

  useEffect(() => {
    if (user) fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setBookings(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase
      .from('bookings')
      .insert([{
        student_id: user.id,
        requested_datetime: form.requested_datetime,
        subject: form.subject,
        notes: form.notes,
        status: 'pending',
      }])

    if (!error) {
      setForm({ requested_datetime: '', subject: 'Computer Science', notes: '' })
      fetchBookings()
    }
    setSubmitting(false)
  }

  const statusConfig = {
    pending: { label: 'قيد المراجعة', color: 'text-vision-warning', bg: 'bg-vision-warning/10', icon: Clock3 },
    confirmed: { label: 'مؤكد', color: 'text-vision-success', bg: 'bg-vision-success/10', icon: CheckCircle },
    rejected: { label: 'مرفوض', color: 'text-vision-danger', bg: 'bg-vision-danger/10', icon: XCircle },
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">الحجوزات</h1>
        <p className="text-vision-textMuted text-sm mt-1">احجز حصتك وتابع حالة طلبك</p>
      </div>

      {/* Booking Form */}
      <div className="vision-card mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-vision-primary" />
          حجز حصة جديدة
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="vision-label">التاريخ والوقت المطلوب *</label>
              <input
                type="datetime-local"
                value={form.requested_datetime}
                onChange={(e) => setForm(prev => ({ ...prev, requested_datetime: e.target.value }))}
                required
                className="vision-input"
                dir="ltr"
              />
            </div>
            <div>
              <label className="vision-label">المادة</label>
              <input
                value={form.subject}
                onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                className="vision-input"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="vision-label">ملاحظات</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="أي ملاحظات إضافية..."
              rows={3}
              className="vision-input resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="vision-btn-primary"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> إرسال الطلب</>}
          </button>
        </form>
      </div>

      {/* Bookings List */}
      <div>
        <h2 className="text-lg font-bold mb-4">طلباتي السابقة</h2>
        {bookings.length === 0 ? (
          <div className="vision-card text-center py-12">
            <Calendar className="w-12 h-12 text-vision-surfaceLight mx-auto mb-3" />
            <p className="text-vision-textMuted">لم تقم بأي حجوزات بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(booking => {
              const status = statusConfig[booking.status] || statusConfig.pending
              const StatusIcon = status.icon

              return (
                <div key={booking.id} className="vision-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{booking.subject}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-vision-textMuted text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(booking.requested_datetime).toLocaleString('ar-EG')}
                      </p>
                      {booking.notes && (
                        <p className="text-vision-textMuted text-xs mt-1">{booking.notes}</p>
                      )}
                    </div>
                    <div className="text-xs text-vision-textMuted">
                      {new Date(booking.created_at).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}