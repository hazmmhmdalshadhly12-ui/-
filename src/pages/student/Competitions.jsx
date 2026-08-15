import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
import { Trophy, Calendar, AlertCircle, Loader2, Clock } from 'lucide-react'

export default function StudentCompetitions() {
  const { user } = useAuth()
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchCompetitions()
  }, [user])

  const fetchCompetitions = async () => {
    const grade = user.profile?.grade
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('grade', grade)
      .order('deadline', { ascending: true })

    if (!error) setCompetitions(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  const now = new Date()
  const active = competitions.filter(c => new Date(c.deadline) > now)
  const ended = competitions.filter(c => new Date(c.deadline) <= now)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">المسابقات</h1>
        <p className="text-vision-textMuted text-sm mt-1">شارك في المسابقات واكسب جوائز وشهادات</p>
      </div>

      {/* Active Competitions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-vision-warning" />
          مسابقات نشطة
        </h2>
        {active.length > 0 ? (
          <div className="space-y-4">
            {active.map(comp => (
              <div key={comp.id} className="vision-card border-l-4 border-l-vision-warning">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{comp.title}</h3>
                    <p className="text-vision-textMuted text-sm mb-3">{comp.description}</p>
                    {comp.details && (
                      <div className="bg-vision-darker rounded-lg p-3 text-sm text-vision-textMuted mb-3">
                        {comp.details}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-vision-warning">
                      <Clock className="w-4 h-4" />
                      ينتهي: {new Date(comp.deadline).toLocaleString('ar-EG')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="vision-card text-center py-12">
            <Trophy className="w-12 h-12 text-vision-surfaceLight mx-auto mb-3" />
            <p className="text-vision-textMuted">لا توجد مسابقات نشطة حالياً</p>
          </div>
        )}
      </div>

      {/* Ended Competitions */}
      {ended.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-vision-textMuted" />
            مسابقات سابقة
          </h2>
          <div className="space-y-3 opacity-60">
            {ended.map(comp => (
              <div key={comp.id} className="vision-card">
                <h3 className="font-bold">{comp.title}</h3>
                <p className="text-vision-textMuted text-sm">{comp.description}</p>
                <p className="text-vision-textMuted text-xs mt-1">
                  انتهت: {new Date(comp.deadline).toLocaleDateString('ar-EG')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}