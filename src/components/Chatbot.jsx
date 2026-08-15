import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'مرحباً! أنا مساعد Vision Academy الذكي. أسألني عن الكورسات، الامتحانات، الحجوزات، أو أي استفسار تاني.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message: userMessage, history: messages }
      })

      if (error) throw error

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'عذراً، حدث خطأ. حاول تاني.' }])
    } catch (err) {
      // Fallback response if edge function not available
      const fallbackResponses = {
        'حجز': 'للحجز، سجل دخولك وروح لصفحة الحجز في لوحة الطالب. المستر هيراجع طلبك ويوافق عليه.',
        'امتحان': 'الامتحانات متاحة في صفحة الامتحانات بعد تسجيل الدخول. كل امتحان ليه محاولة واحدة بس.',
        'كورس': 'عندنا كورسات للصف الأول والثاني الثانوي في مادة Computer Science. شوف الكورسات من الرئيسية.',
        'تواصل': 'تقدر تتواصل معانا من صفحة التواصل فيها أرقام الواتساب والسوشيال ميديا.',
        'مسابقة': 'المسابقات بتظهر في لوحة الطالب مع تفاصيلها ومواعيد الانتهاء.',
      }

      let reply = 'عذراً، خدمة الشات الذكي مش متاحة حالياً. جرب تسأل عن: الحجز، الامتحانات، الكورسات، التواصل، أو المسابقات.'
      for (const [key, value] of Object.entries(fallbackResponses)) {
        if (userMessage.includes(key)) {
          reply = value
          break
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-vision-danger rotate-90' : 'bg-gradient-to-br from-vision-primary to-vision-accent hover:shadow-vision-primary/40 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[90vw] max-w-sm bg-vision-surface border border-vision-surfaceLight rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '500px', maxHeight: '70vh' }}>
          {/* Header */}
          <div className="bg-gradient-to-l from-vision-primary to-vision-accent px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">مساعد Vision</h3>
              <p className="text-white/70 text-xs">ذكي ومتواصل 24/7</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-vision-primary/20' : 'bg-vision-accent/20'
                }`}>
                  {msg.role === 'user' ? <UserIcon className="w-4 h-4 text-vision-primary" /> : <Bot className="w-4 h-4 text-vision-accent" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-vision-primary text-white rounded-tr-sm'
                    : 'bg-vision-surfaceLight text-vision-text rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-vision-accent/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-vision-accent" />
                </div>
                <div className="bg-vision-surfaceLight rounded-2xl rounded-tl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 text-vision-accent animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-vision-surfaceLight p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 bg-vision-darker border border-vision-surfaceLight rounded-lg px-3 py-2 text-sm text-vision-text placeholder-vision-textMuted focus:border-vision-primary focus:ring-1 focus:ring-vision-primary transition-all"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-lg bg-vision-primary text-white flex items-center justify-center hover:bg-vision-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}