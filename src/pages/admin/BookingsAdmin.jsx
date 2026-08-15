import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Calendar, CheckCircle, XCircle, Clock3, Loader2 } from 'lucide-react'

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*, profiles(full_name, phone, grade)')
      .order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchBookings()
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">الحجوزات</h1>
        <p className="text-vision-textMuted text-sm mt-1">مراجعة وإدارة طلبات الحجز</p>
      </div>

      <div className="space-y-3">
        {bookings.map(booking => {
          const status = statusConfig[booking.status] || statusConfig.pending
          const StatusIcon = status.icon

          return (
            <div key={booking.id} className="vision-card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold">{booking.profiles?.full_name || '—'}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" /> {status.label}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2 text-sm text-vision-textMuted">
                    <span>📞 {booking.profiles?.phone || '—'}</span>
                    <span>🎓 {booking.profiles?.grade === 'first_secondary' ? 'الأول الثانوي' : 'الثاني الثانوي'}</span>
                    <span>📅 {new Date(booking.requested_datetime).toLocaleString('ar-EG')}</span>
                  </div>
                  {booking.notes && <p className="text-sm text-vision-textMuted mt-2">📝 {booking.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(booking.id, 'confirmed')} className="px-3 py-1.5 rounded-lg bg-vision-success/10 text-vision-success text-sm font-medium hover:bg-vision-success/20 transition-colors">
                    تأكيد
                  </button>
                  <button onClick={() => updateStatus(booking.id, 'rejected')} className="px-3 py-1.5 rounded-lg bg-vision-danger/10 text-vision-danger text-sm font-medium hover:bg-vision-danger/20 transition-colors">
                    رفض
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-20 text-vision-textMuted">لا توجد حجوزات</div>
      )}
    </div>
  )
}