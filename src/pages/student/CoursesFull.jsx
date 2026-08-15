import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
import { PlayCircle, BookOpen, GraduationCap, Loader2, ExternalLink } from 'lucide-react'

export default function StudentCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchCourses()
  }, [user])

  const fetchCourses = async () => {
    const grade = user.profile?.grade
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('grade', grade)
      .order('order_index', { ascending: true })

    if (!error) setCourses(data || [])
    setLoading(false)
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
        <h1 className="text-2xl font-bold">الكورسات</h1>
        <p className="text-vision-textMuted text-sm mt-1">فيديوهات تعليمية مُحضّرة خصيصاً لصفك</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <GraduationCap className="w-16 h-16 text-vision-surfaceLight mx-auto mb-4" />
          <p className="text-vision-text-muted">لا توجد كورسات متاحة لصفك حالياً</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course, i) => (
            <div key={course.id} className="vision-card flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-vision-primary to-vision-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">{i + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                <p className="text-vision-textMuted text-sm mb-3">{course.description}</p>
                {course.video_url && (
                  <a
                    href={course.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-vision-primary hover:text-vision-accent transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    مشاهدة الفيديو
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}