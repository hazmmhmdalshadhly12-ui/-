# Vision Academy 🎓

منصة تعليمية متكاملة لمادة البرمجة (Computer Science) للصف الأول والثاني الثانوي.

## التقنيات

- **Frontend:** React 18 + Vite + Tailwind CSS (RTL بالكامل)
- **Backend & Database:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI Chatbot:** Supabase Edge Function (مخفي API Key)
- **Fonts:** Cairo + Tajawal

## هيكل المشروع

```
vision-academy/
├── src/
│   ├── components/     # Navbar, Footer, Chatbot, Layout, ProtectedRoute
│   ├── pages/
│   │   ├── public/     # Home, Courses, Contact, Login, Register
│   │   ├── student/    # Dashboard, Exams, ExamTake, Grades, Courses, Bookings, Competitions
│   │   └── admin/      # Dashboard, Exams, Grades, Courses, Bookings, Competitions, Users, Contact
│   ├── lib/            # supabaseClient.js
│   ├── hooks/          # useAuth.js, useSupabase.js
│   ├── App.jsx         # React Router
│   ├── main.jsx
│   └── index.css       # Tailwind + Custom styles
├── supabase/
│   ├── migrations/001_initial.sql
│   └── functions/chatbot/index.ts
├── .github/workflows/deploy.yml
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── .env.example
```

## خطوات التشغيل المحلي

```bash
# 1. Clone
npm install

# 2. Create .env file
cp .env.example .env
# Fill in your Supabase credentials

# 3. Run
npm run dev
```

## خطوات النشر

### 1. إنشاء مشروع Supabase
1. اذهب إلى [supabase.com](https://supabase.com) وسجل حساب مجاني
2. أنشئ مشروع جديد
3. اذهب إلى SQL Editor وشغّل ملف `supabase/migrations/001_initial.sql`

### 2. إعداد Auth
- في Supabase Dashboard → Authentication → Settings
- فعل "Email Confirmations" لو عايز تأكيد الإيميل
- في URL Configuration ضبط Site URL و Redirect URLs

### 3. إعداد Edge Function (Chatbot)
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy chatbot

# Set environment variable for AI API
supabase secrets set AI_API_KEY=your-openai-or-claude-key
```

### 4. إنشاء حساب Admin
```sql
-- في SQL Editor
UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
```

### 5. رفع Frontend على GitHub Pages
1. أنشئ repo على GitHub
2. ارفع الكود
3. في Settings → Pages → Source: GitHub Actions
4. ملف `.github/workflows/deploy.yml` جاهز — هينشر تلقائياً

### 6. Environment Variables
أضف في GitHub repo secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## حسابات تجريبية

| الدور | الإيميل | الباسورد |
|-------|---------|----------|
| Admin | (أنشئه يدوياً وعدل role في قاعدة البيانات) | — |
| Student | سجل حساب جديد | — |

## ملاحظات أمنية مهمة

1. **محاولة امتحان واحدة:** مضمونة من قاعدة البيانات عبر `UNIQUE (exam_id, student_id)` — حتى لو الطالب حاول التلاعب من Network.
2. **Admin verification:** يتم التحقق من `role = 'admin'` في Row Level Security Policies في Supabase، مش بس في الواجهة.
3. **API Key مخفي:** مفتاح AI API مخزن في Supabase Edge Function secrets، مش في Frontend.
4. **الإجابات الصحيحة:** لا تُرسل للـ Frontend إلا بعد التسليم.

## الألوان (Design System)

| اللون | الكود | الاستخدام |
|-------|-------|-----------|
| Dark | `#0B0F19` | خلفية رئيسية |
| Primary | `#6366F1` | Indigo — أزرار رئيسية |
| Accent | `#22D3EE` | Cyan — تفاعلات وهوفر |
| Surface | `#111827` | خلفية الكروت |
| Success | `#10B981` | أخضر — النجاح |
| Warning | `#F59E0B` | برتقالي — التحذير |
| Danger | `#EF4444` | أحمر — الخطأ |

## الترخيص

MIT License - مفتوح المصدر للاستخدام التعليمي.
