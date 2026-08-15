import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
import { Clock, AlertTriangle, Send, Loader2, ChevronRight, ChevronLeft, Flag } from 'lucide-react'

export default function ExamTake() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (user) fetchExam()
  }, [user, examId])

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const fetchExam = async () => {
    try {
      // Check if already submitted (server-side constraint will also enforce this)
      const { data: existingSub } = await supabase
        .from('exam_submissions')
        .select('*')
        .eq('exam_id', examId)
        .eq('student_id', user.id)
        .single()

      if (existingSub) {
        setError('لقد قمت بتسليم هذا الامتحان مسبقاً. لا يمكن إعادة المحاولة.')
        setLoading(false)
        return
      }

      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single()

      if (!examData) {
        setError('الامتحان غير موجود')
        setLoading(false)
        return
      }

      const now = new Date()
      const start = new Date(examData.start_at)
      const end = new Date(examData.end_at)

      if (now < start || now > end) {
        setError('الامتحان غير متاح حالياً')
        setLoading(false)
        return
      }

      const { data: questionsData } = await supabase
        .from('exam_questions')
        .select('*')
        .eq('exam_id', examId)
        .order('id')

      setExam(examData)
      setQuestions(questionsData || [])
      setTimeLeft(examData.duration_minutes * 60)
      setLoading(false)
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الامتحان')
      setLoading(false)
    }
  }

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting) return
    setSubmitting(true)

    try {
      const formattedAnswers = questions.map(q => ({
        question_id: q.id,
        answer: answers[q.id] || null,
      }))

      // Calculate auto-score for MCQ and true_false
      let autoScore = 0
      let totalPoints = 0
      questions.forEach(q => {
        totalPoints += q.points || 0
        if ((q.type === 'mcq' || q.type === 'true_false') && answers[q.id] === q.correct_answer) {
          autoScore += q.points || 0
        }
      })

      const scorePercent = totalPoints > 0 ? (autoScore / totalPoints) * 100 : 0

      const { error: subError } = await supabase
        .from('exam_submissions')
        .insert([{
          exam_id: examId,
          student_id: user.id,
          answers: formattedAnswers,
          score: scorePercent,
        }])

      if (subError) {
        if (subError.code === '23505') {
          setError('لقد قمت بتسليم هذا الامتحان مسبقاً.')
        } else {
          throw subError
        }
        return
      }

      navigate('/student/grades')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }, [answers, questions, examId, user, submitting, navigate])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-vision-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">تنبيه</h2>
          <p className="text-vision-textMuted mb-6">{error}</p>
          <button onClick={() => navigate('/student/exams')} className="vision-btn-primary">
            العودة للامتحانات
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQ]
  const answeredCount = Object.keys(answers).length
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  return (
    <div className="min-h-screen bg-vision-darker">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-vision-dark/95 backdrop-blur-xl border-b border-vision-surfaceLight">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-sm sm:text-base">{exam.title}</h1>
            <p className="text-vision-textMuted text-xs">سؤال {currentQ + 1} من {questions.length}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${timeLeft < 300 ? 'bg-vision-danger/20 text-vision-danger' : 'bg-vision-primary/10 text-vision-primary'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="h-1 bg-vision-surfaceLight">
          <div className="h-full bg-vision-primary transition-all duration-300" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="vision-card sticky top-36">
              <h3 className="font-bold text-sm mb-3">أسئلة الامتحان</h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQ(i)}
                    className={`w-full aspect-square rounded-lg text-sm font-medium transition-all ${
                      i === currentQ
                        ? 'bg-vision-primary text-white'
                        : answers[q.id]
                        ? 'bg-vision-success/20 text-vision-success border border-vision-success/30'
                        : 'bg-vision-surfaceLight text-vision-textMuted hover:bg-vision-surfaceLight/80'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-vision-surfaceLight">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-vision-textMuted">التقدم</span>
                  <span className="font-medium">{answeredCount}/{questions.length}</span>
                </div>
                <div className="h-2 bg-vision-surfaceLight rounded-full overflow-hidden">
                  <div className="h-full bg-vision-success rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {currentQuestion && (
              <div className="vision-card">
                <div className="flex items-start gap-3 mb-6">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-vision-primary/10 text-vision-primary flex items-center justify-center font-bold text-sm">
                    {currentQ + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-lg font-medium leading-relaxed">{currentQuestion.question_text}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-vision-surfaceLight text-vision-textMuted">
                      {currentQuestion.type === 'mcq' ? 'اختيار من متعدد' : currentQuestion.type === 'true_false' ? 'صح أو خطأ' : 'سؤال مقالي'}
                    </span>
                  </div>
                </div>

                {/* MCQ */}
                {currentQuestion.type === 'mcq' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          answers[currentQuestion.id] === option
                            ? 'border-vision-primary bg-vision-primary/10'
                            : 'border-vision-surfaceLight hover:border-vision-primary/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQuestion.id}`}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={() => handleAnswer(currentQuestion.id, option)}
                          className="w-4 h-4 text-vision-primary focus:ring-vision-primary"
                        />
                        <span className="flex-1">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {currentQuestion.type === 'true_false' && (
                  <div className="grid grid-cols-2 gap-4">
                    {['صح', 'خطأ'].map(option => (
                      <label
                        key={option}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                          answers[currentQuestion.id] === option
                            ? 'border-vision-primary bg-vision-primary/10'
                            : 'border-vision-surfaceLight hover:border-vision-primary/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQuestion.id}`}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={() => handleAnswer(currentQuestion.id, option)}
                          className="w-4 h-4 text-vision-primary"
                        />
                        <span className="font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Short Answer */}
                {currentQuestion.type === 'short_answer' && (
                  <textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder="اكتب إجابتك هنا..."
                    rows={5}
                    className="vision-input resize-none"
                  />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-vision-surfaceLight">
                  <button
                    onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                    disabled={currentQ === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vision-surfaceLight transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    السابق
                  </button>

                  {currentQ < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQ(currentQ + 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-vision-primary text-white hover:bg-vision-primary/90 transition-colors"
                    >
                      التالي
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-vision-success text-white hover:bg-vision-success/90 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      تسليم الامتحان
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-vision-surface border border-vision-surfaceLight rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-vision-warning/20 flex items-center justify-center">
                <Flag className="w-5 h-5 text-vision-warning" />
              </div>
              <h3 className="text-lg font-bold">تأكيد التسليم</h3>
            </div>
            <p className="text-vision-textMuted mb-2">
              أنت على وشك تسليم الامتحان. <strong className="text-vision-danger">لا يمكن التراجع بعد التسليم.</strong>
            </p>
            <p className="text-sm text-vision-textMuted mb-6">
              تم الإجابة على {answeredCount} من {questions.length} سؤال
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-vision-surfaceLight text-sm font-medium hover:bg-vision-surfaceLight transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => { setShowConfirm(false); handleSubmit(); }}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg bg-vision-success text-white text-sm font-medium hover:bg-vision-success/90 disabled:opacity-50 transition-colors"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'تأكيد التسليم'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}