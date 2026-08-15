import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history } = await req.json()

    const systemPrompt = `أنت مساعد ذكي لـ Vision Academy - أكاديمية الرؤية للبرمجة.

معلومات عن الأكاديمية:
- Vision Academy هي منصة تعليمية متخصصة في مادة Computer Science للصف الأول والثاني الثانوي.
- المستر متخصص في تدريس البرمجة للثانوي العام.
- الكورسات تشمل: Python, OOP, قواعد البيانات, الخوارزميات.
- الطلاب يمكنهم: حجز حصص، حل امتحانات إلكترونية، المشاركة في مسابقات، مشاهدة فيديوهات تعليمية.
- كل امتحان له محاولة واحدة فقط.
- الحجز يتم مراجعته يدوياً من المستر.
- التواصل متاح عبر واتساب وتليجرام وفيسبوك ويوتيوب وإنستجرام.
- الموقع يدعم RTL (العربية) بالكامل.

أجب باختصار ووضوح باللغة العربية. إذا كان السؤال خارج نطاق الأكاديمية، وجه الطالب للتواصل مع المستر مباشرة.`

    const apiKey = Deno.env.get('AI_API_KEY')
    const apiUrl = Deno.env.get('AI_API_URL') || 'https://api.openai.com/v1/chat/completions'

    if (apiKey) {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...(history || []).map((h) => ({ role: h.role, content: h.content })),
            { role: 'user', content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data.choices?.[0]?.message?.content || 'عذراً، لم أفهم سؤالك.'
        return new Response(JSON.stringify({ reply }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const fallbackResponses = {
      'حجز': 'للحجز، سجل دخولك وروح لصفحة الحجز في لوحة الطالب. المستر هيراجع طلبك ويوافق عليه.',
      'امتحان': 'الامتحانات متاحة في صفحة الامتحانات بعد تسجيل الدخول. كل امتحان ليه محاولة واحدة بس.',
      'كورس': 'عندنا كورسات للصف الأول والثاني الثانوي في مادة Computer Science. شوف الكورسات من الرئيسية.',
      'تواصل': 'تقدر تتواصل معانا من صفحة التواصل فيها أرقام الواتساب والسوشيال ميديا.',
      'مسابقة': 'المسابقات بتظهر في لوحة الطالب مع تفاصيلها ومواعيد الانتهاء.',
      'تسجيل': 'سجل حساب جديد من صفحة التسجيل باسمك ورقم موبايلك وصفك الدراسي وإيميلك.',
      'سعر': 'للاستفسار عن الأسعار، تواصل مع المستر مباشرة عبر الواتساب.',
      'درجة': 'الدرجات بتظهر في صفحة درجاتي بعد ما المستر يراجعها وينشرها.',
    }

    let reply = 'أهلاً بيك في Vision Academy! أسألني عن الكورسات، الامتحانات، الحجوزات، أو التواصل. لو عندك سؤال محدد، المستر جاهز يساعدك.'
    for (const [key, value] of Object.entries(fallbackResponses)) {
      if (message.toLowerCase().includes(key)) {
        reply = value
        break
      }
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ reply: 'عذراً، حدث خطأ في الخدمة. حاول تاني لاحقاً.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})