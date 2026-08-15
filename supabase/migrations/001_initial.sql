-- Vision Academy Database Schema
-- Run this in Supabase SQL Editor

-- Enable RLS
alter table if exists profiles enable row level security;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  parent_phone text,
  grade text CHECK (grade IN ('first_secondary','second_secondary')),
  role text DEFAULT 'student' CHECK (role IN ('student','admin')),
  created_at timestamp with time zone DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  grade text CHECK (grade IN ('first_secondary','second_secondary')),
  video_url text,
  order_index int DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  grade text CHECK (grade IN ('first_secondary','second_secondary')),
  duration_minutes int DEFAULT 30,
  start_at timestamp with time zone,
  end_at timestamp with time zone,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Exam Questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  type text CHECK (type IN ('mcq','true_false','short_answer')),
  options jsonb DEFAULT '[]',
  correct_answer text,
  points int DEFAULT 1,
  created_at timestamp with time zone DEFAULT now()
);

-- Exam Submissions table (ONE ATTEMPT ONLY enforced by unique constraint)
CREATE TABLE IF NOT EXISTS exam_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  answers jsonb DEFAULT '[]',
  score numeric,
  grade_released boolean DEFAULT false,
  submitted_at timestamp with time zone DEFAULT now(),
  UNIQUE (exam_id, student_id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  requested_datetime timestamp with time zone,
  subject text DEFAULT 'Computer Science',
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected')),
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  grade text CHECK (grade IN ('first_secondary','second_secondary')),
  deadline timestamp with time zone,
  details text,
  created_at timestamp with time zone DEFAULT now()
);

-- Contact Links table
CREATE TABLE IF NOT EXISTS contact_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Profiles are viewable by owner" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by admin" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Profiles: Users can update their own profile only
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Courses: Everyone can read, only admin can write
CREATE POLICY "Courses readable by all" ON courses FOR SELECT USING (true);
CREATE POLICY "Courses writable by admin" ON courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Exams: Everyone can read published, admin can write
CREATE POLICY "Exams readable by all" ON exams FOR SELECT USING (true);
CREATE POLICY "Exams writable by admin" ON exams
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Exam Questions: Everyone can read, admin can write
CREATE POLICY "Questions readable by all" ON exam_questions FOR SELECT USING (true);
CREATE POLICY "Questions writable by admin" ON exam_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Exam Submissions: Students can read their own, admin can read all
CREATE POLICY "Submissions readable by owner" ON exam_submissions
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Submissions readable by admin" ON exam_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Students can insert own submissions" ON exam_submissions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admin can update submissions" ON exam_submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Bookings: Students can read their own, admin can read all
CREATE POLICY "Bookings readable by owner" ON bookings
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Bookings readable by admin" ON bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Students can insert own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admin can update bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Competitions: Everyone can read, admin can write
CREATE POLICY "Competitions readable by all" ON competitions FOR SELECT USING (true);
CREATE POLICY "Competitions writable by admin" ON competitions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Contact Links: Everyone can read, admin can write
CREATE POLICY "Contact readable by all" ON contact_links FOR SELECT USING (true);
CREATE POLICY "Contact writable by admin" ON contact_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA (Demo)
-- ============================================

INSERT INTO contact_links (platform, label, value) VALUES
  ('whatsapp', 'واتساب', '01234567890'),
  ('phone', 'تليفون', '01234567890'),
  ('facebook', 'فيسبوك', 'https://facebook.com/visionacademy'),
  ('youtube', 'يوتيوب', 'https://youtube.com/visionacademy'),
  ('telegram', 'تليجرام', 'https://t.me/visionacademy'),
  ('instagram', 'إنستجرام', 'https://instagram.com/visionacademy')
ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, grade, video_url, order_index) VALUES
  ('مقدمة في البرمجة', 'أساسيات البرمجة والخوارزميات للصف الأول الثانوي', 'first_secondary', 'https://youtube.com/watch?v=demo1', 1),
  ('Python للمبتدئين', 'تعلم لغة Python من الصفر', 'first_secondary', 'https://youtube.com/watch?v=demo2', 2),
  ('البرمجة الكائنية OOP', 'مفاهيم OOP والتصميم الكائني', 'second_secondary', 'https://youtube.com/watch?v=demo3', 1),
  ('قواعد البيانات SQL', 'إدارة البيانات باستخدام SQL', 'second_secondary', 'https://youtube.com/watch?v=demo4', 2)
ON CONFLICT DO NOTHING;

INSERT INTO competitions (title, description, grade, deadline, details) VALUES
  ('تحدي البرمجة الأول', 'حل 5 مسائل برمجية في أقل وقت', 'first_secondary', NOW() + INTERVAL '7 days', 'المسابقة مفتوحة لجميع طلاب الصف الأول. الجائزة: شهادة تقدير + نقاط إضافية.'),
  ('مشروع نهاية الفصل', 'بناء تطبيق بسيط باستخدام Python', 'second_secondary', NOW() + INTERVAL '14 days', 'قدم مشروعك قبل الموعد النهائي. سيتم تقييم المشاريع من قبل المستر.')
ON CONFLICT DO NOTHING;