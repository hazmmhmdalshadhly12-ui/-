import { Link } from 'react-router-dom'
import { Eye, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-vision-surfaceLight bg-vision-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vision-primary to-vision-accent flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Vision Academy</span>
            </Link>
            <p className="text-vision-textMuted text-sm leading-relaxed">
              منصة تعليمية متخصصة في مادة البرمجة (Computer Science) للصف الأول والثاني الثانوي. نبني المستقبل بأيدي طلابنا.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-vision-text font-semibold mb-4">روابط سريعة</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-vision-textMuted hover:text-vision-accent text-sm transition-colors">الرئيسية</Link>
              <Link to="/courses" className="block text-vision-textMuted hover:text-vision-accent text-sm transition-colors">الكورسات</Link>
              <Link to="/contact" className="block text-vision-textMuted hover:text-vision-accent text-sm transition-colors">تواصل معنا</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-vision-text font-semibold mb-4">معلومات التواصل</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-vision-textMuted text-sm">
                <MapPin className="w-4 h-4 text-vision-primary" />
                <span>مصر - متاح أونلاين لجميع المحافظات</span>
              </div>
              <div className="flex items-center gap-2 text-vision-textMuted text-sm">
                <Phone className="w-4 h-4 text-vision-primary" />
                <span>متاح عبر صفحة التواصل</span>
              </div>
              <div className="flex items-center gap-2 text-vision-textMuted text-sm">
                <Mail className="w-4 h-4 text-vision-primary" />
                <span>info@visionacademy.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glow-line my-8" />

        <div className="text-center text-vision-textMuted text-sm">
          © {new Date().getFullYear()} Vision Academy. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}