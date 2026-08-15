import { Link } from 'react-router-dom'
import { Eye, Code, Trophy, BookOpen, Users, Clock, ChevronLeft, Sparkles, Terminal, Cpu, Globe } from 'lucide-react'

export default function Home() {
  const features = [
    { icon: Code, title: 'كورسات برمجة متخصصة', desc: 'محتوى مُحضّر بعناية للصف الأول والثاني الثانوي في مادة Computer Science' },
    { icon: Trophy, title: 'امتحانات تفاعلية', desc: 'امتحانات إلكترونية مع تصحيح تلقائي ونتائج فورية بعد المراجعة' },
    { icon: BookOpen, title: 'حجز حصص مباشرة', desc: 'احجز حصتك بسهولة وتابع حالة طلبك مباشرة من لوحة الطالب' },
    { icon: Users, title: 'مسابقات تحفيزية', desc: 'شارك في المسابقات واكسب جوائز وشهادات تقدير' },
    { icon: Clock, title: 'جدول مرن', desc: 'تعلم في وقتك المفضل مع محتوى متاح على مدار الساعة' },
    { icon: Sparkles, title: 'مساعد ذكي', desc: 'شات بوت ذكي يساعدك في أي استفسار على مدار اليوم' },
  ]

  const stats = [
    { value: '500+', label: 'طالب مسجل' },
    { value: '50+', label: 'فيديو تعليمي' },
    { value: '100+', label: 'امتحان منفّذ' },
    { value: '98%', label: 'نسبة الرضا' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-vision-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-vision-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-vision-primary/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-vision-accent/10 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vision-primary/10 border border-vision-primary/20 text-vision-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                منصة تعليمية متكاملة للبرمجة
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
                <span className="text-vision-text">ابني</span>{' '}
                <span className="gradient-text">مستقبلك</span>{' '}
                <span className="text-vision-text">بأيديك</span>
              </h1>
              <p className="text-lg text-vision-textMuted leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Vision Academy هي منصتك الأولى لتعلم مادة Computer Science للصف الأول والثاني الثانوي. 
                مع مستر متخصص ومحتوى تفاعلي يضمنلك التفوق.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="vision-btn-primary text-lg">
                  ابدأ رحلتك الآن
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <Link to="/courses" className="vision-btn-outline text-lg">
                  استكشف الكورسات
                </Link>
              </div>
            </div>

            {/* Code Visual - Signature Element */}
            <div className="relative hidden lg:block">
              <div className="relative bg-vision-surface border border-vision-surfaceLight rounded-2xl p-6 shadow-2xl shadow-vision-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-vision-danger" />
                  <div className="w-3 h-3 rounded-full bg-vision-warning" />
                  <div className="w-3 h-3 rounded-full bg-vision-success" />
                  <span className="mr-auto text-xs text-vision-textMuted font-mono">vision_academy.py</span>
                </div>
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-vision-primary">class</span>{' '}
                    <span className="text-vision-accent">Student</span>:{'
'}
                    {'    '}<span className="text-vision-primary">def</span>{' '}
                    <span className="text-vision-accent">__init__</span>(self):{'
'}
                    {'        '}self.mind = <span className="text-vision-success">"open"</span>{'
'}
                    {'        '}self.passion = <span className="text-vision-success">"infinite"</span>{'
'}
                    {'        '}self.vision = <span className="text-vision-success">"clear"</span>{'
'}
                    {'
'}
                    {'    '}<span className="text-vision-primary">def</span>{' '}
                    <span className="text-vision-accent">learn</span>(self, topic):{'
'}
                    {'        '}<span className="text-vision-primary">return</span>{' '}
                    <span className="text-vision-success">f"Mastered {topic}!"</span>{'
'}
                    {'
'}
                    {'    '}<span className="text-vision-primary">def</span>{' '}
                    <span className="text-vision-accent">succeed</span>(self):{'
'}
                    {'        '}<span className="text-vision-primary">return</span>{' '}
                    <span className="text-vision-warning">True</span>{'
'}
                  </code>
                </pre>
                <div className="absolute -bottom-4 -right-4 bg-vision-surface border border-vision-surfaceLight rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-vision-success/20 flex items-center justify-center">
                      <Terminal className="w-5 h-5 text-vision-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">تشغيل الكود</p>
                      <p className="text-xs text-vision-textMuted">Mastered Python!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-vision-surfaceLight bg-vision-darker/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-vision-textMuted text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">لماذا <span className="gradient-text">Vision Academy</span>؟</h2>
            <p className="text-vision-textMuted max-w-2xl mx-auto">منصة مصممة خصيصاً لطلاب الثانوي العام، بمحتوى احترافي وتجربة مستخدم سلسة</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="vision-card group">
                <div className="w-12 h-12 rounded-xl bg-vision-primary/10 flex items-center justify-center mb-4 group-hover:bg-vision-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-vision-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-vision-textMuted text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-vision-primary/10 to-vision-accent/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Cpu className="w-12 h-12 text-vision-accent mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">جاهز تبدأ رحلتك في عالم البرمجة؟</h2>
          <p className="text-vision-textMuted mb-8 max-w-xl mx-auto">
            انضم لأكثر من 500 طالب سجلوا في Vision Academy وابدأ رحلتك نحو التفوق في Computer Science
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="vision-btn-primary text-lg">
              سجل الآن مجاناً
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="vision-btn-outline text-lg">
              تواصل مع المستر
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}