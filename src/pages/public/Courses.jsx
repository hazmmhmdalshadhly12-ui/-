import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { BookOpen, Lock, PlayCircle, GraduationCap, Loader2 } from 'lucide-react'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGrade, setSelectedGrade] = useState('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('order_index', { ascending: true })

    if (!error) setCourses(data || [])
    setLoading(false)
  }

  const filteredCourses = selectedGrade === 'all' 
    ? courses 
    : courses.filter(c => c.grade === selectedGrade)

  const gradeLabels = {
    first_secondary: 'الصف الأول الثانوي',
    second_secondary: 'الصف الثاني الثانوي',
  }

  // Demo data if no courses in DB
  const demoCourses = [
    { id: '1', title: 'مقدمة في البرمجة', description: 'أساسيات البرمجة والخوارزميات', grade: 'first_secondary', order_index: 1 },
    { id: '2', title: 'Python للمبتدئين', description: 'تعلم لغة Python من الصفر', grade: 'first_secondary', order_index: 2 },
    { id: '3', title: 'البرمجة الكائنية', description: 'OOP والتصميم الكائني', grade: 'second_secondary', order_index: 1 },
    { id: '4', title: 'قواعد البيانات', description: 'SQL وإدارة البيانات', grade: 'second_secondary', order_index: 2 },
  ]

  const displayCourses = courses.length > 0 ? filteredCourses : demoCourses.filter(c => selectedGrade === 'all' || c.grade === selectedGrade)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">الكورسات <span className="gradient-text">المتاحة</span></h1>
        <p className="text-vision-textMuted max-w-2xl mx-auto">
          محتوى تعليمي مُحضّر بعناية للصف الأول والثاني الثانوي. سجل دخولك لمشاهدة الفيديوهات الكاملة.
        </p>
      </div>

      {/* Filter */}
      <div className="flex justify-center gap-3 mb-10">
        {[
          { value: 'all', label: 'الكل' },
          { value: 'first_secondary', label: 'الأول الثانوي' },
          { value: 'second_secondary', label: 'الثاني الثانوي' },
        ].map(g => (
          <button
            key={g.value}
            onClick={() => setSelectedGrade(g.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedGrade === g.value
                ? 'bg-vision-primary text-white'
                : 'bg-vision-surface text-vision-textMuted hover:text-vision-text border border-vision-surfaceLight'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map(course => (
            <div key={course.id} className="vision-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vision-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vision-primary to-vision-accent flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-md bg-vision-primary/10 text-vision-primary text-xs font-medium">
                    {gradeLabels[course.grade] || course.grade}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-vision-textMuted text-sm mb-6 leading-relaxed">{course.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-vision-textMuted text-sm">
                    <PlayCircle className="w-4 h-4" />
                    <span>فيديوهات تعليمية</span>
                  </div>
                  <Link 
                    to="/login"
                    className="flex items-center gap-1.5 text-sm font-medium text-vision-primary hover:text-vision-accent transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    سجل للمشاهدة
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {displayCourses.length === 0 && (
        <div className="text-center py-20">
          <GraduationCap className="w-16 h-16 text-vision-surfaceLight mx-auto mb-4" />
          <p className="text-vision-textMuted">لا توجد كورسات متاحة حالياً</p>
        </div>
      )}
    </div>
  )
}