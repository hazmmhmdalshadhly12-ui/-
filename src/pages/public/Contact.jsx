import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Phone, MessageSquare, Facebook, Youtube, Instagram, Send, Globe, Loader2, ExternalLink } from 'lucide-react'

export default function Contact() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from('contact_links')
      .select('*')
      .order('id')

    if (!error) setLinks(data || [])
    setLoading(false)
  }

  const iconMap = {
    whatsapp: MessageSquare,
    phone: Phone,
    facebook: Facebook,
    youtube: Youtube,
    telegram: Send,
    instagram: Instagram,
    website: Globe,
    default: ExternalLink,
  }

  const getIcon = (platform) => {
    const Icon = iconMap[platform?.toLowerCase()] || iconMap.default
    return Icon
  }

  const colorMap = {
    whatsapp: 'text-green-400 bg-green-400/10 border-green-400/20',
    phone: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    facebook: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    youtube: 'text-red-500 bg-red-500/10 border-red-500/20',
    telegram: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    instagram: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    default: 'text-vision-primary bg-vision-primary/10 border-vision-primary/20',
  }

  // Demo data
  const demoLinks = [
    { id: '1', platform: 'whatsapp', label: 'واتساب', value: '01234567890' },
    { id: '2', platform: 'phone', label: 'تليفون', value: '01234567890' },
    { id: '3', platform: 'facebook', label: 'فيسبوك', value: 'https://facebook.com/visionacademy' },
    { id: '4', platform: 'youtube', label: 'يوتيوب', value: 'https://youtube.com/visionacademy' },
    { id: '5', platform: 'telegram', label: 'تليجرام', value: 'https://t.me/visionacademy' },
    { id: '6', platform: 'instagram', label: 'إنستجرام', value: 'https://instagram.com/visionacademy' },
  ]

  const displayLinks = links.length > 0 ? links : demoLinks

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">تواصل <span className="gradient-text">معنا</span></h1>
        <p className="text-vision-text-muted max-w-xl mx-auto">
          تواصل مع Vision Academy من خلال أي من القنوات التالية. المستر جاهز يرد على استفساراتك.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-vision-primary animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {displayLinks.map(link => {
            const Icon = getIcon(link.platform)
            const colorClass = colorMap[link.platform?.toLowerCase()] || colorMap.default
            const isUrl = link.value?.startsWith('http')

            return (
              <a
                key={link.id}
                href={isUrl ? link.value : `tel:${link.value}`}
                target={isUrl ? '_blank' : undefined}
                rel={isUrl ? 'noopener noreferrer' : undefined}
                className={`flex items-center gap-4 p-5 rounded-xl border transition-all hover:scale-[1.02] ${colorClass}`}
              >
                <div className="w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{link.label}</h3>
                  <p className="text-sm opacity-80 truncate">{link.value}</p>
                </div>
                <ExternalLink className="w-5 h-5 opacity-50" />
              </a>
            )
          })}
        </div>
      )}

      <div className="mt-12 vision-card text-center">
        <h3 className="text-lg font-bold mb-2">مواعيد الاستجابة</h3>
        <p className="text-vision-textMuted text-sm">
          نستجيب على الاستفسارات خلال 24 ساعة في أيام العمل. للاستفسارات العاجلة استخدم الواتساب.
        </p>
      </div>
    </div>
  )
}