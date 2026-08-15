import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import Home from './pages/public/Home'
import Courses from './pages/public/Courses'
import Contact from './pages/public/Contact'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentExams from './pages/student/Exams'
import ExamTake from './pages/student/ExamTake'
import StudentGrades from './pages/student/Grades'
import StudentCourses from './pages/student/CoursesFull'
import StudentBookings from './pages/student/Bookings'
import StudentCompetitions from './pages/student/Competitions'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ExamsAdmin from './pages/admin/ExamsAdmin'
import GradesAdmin from './pages/admin/GradesAdmin'
import CoursesAdmin from './pages/admin/CoursesAdmin'
import BookingsAdmin from './pages/admin/BookingsAdmin'
import CompetitionsAdmin from './pages/admin/CompetitionsAdmin'
import UsersAdmin from './pages/admin/UsersAdmin'
import ContactAdmin from './pages/admin/ContactAdmin'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/exams" element={
            <ProtectedRoute><StudentExams /></ProtectedRoute>
          } />
          <Route path="/student/exams/:examId" element={
            <ProtectedRoute><ExamTake /></ProtectedRoute>
          } />
          <Route path="/student/grades" element={
            <ProtectedRoute><StudentGrades /></ProtectedRoute>
          } />
          <Route path="/student/courses" element={
            <ProtectedRoute><StudentCourses /></ProtectedRoute>
          } />
          <Route path="/student/bookings" element={
            <ProtectedRoute><StudentBookings /></ProtectedRoute>
          } />
          <Route path="/student/competitions" element={
            <ProtectedRoute><StudentCompetitions /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/exams" element={
            <ProtectedRoute requireAdmin={true}><ExamsAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/grades" element={
            <ProtectedRoute requireAdmin={true}><GradesAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute requireAdmin={true}><CoursesAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute requireAdmin={true}><BookingsAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/competitions" element={
            <ProtectedRoute requireAdmin={true}><CompetitionsAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin={true}><UsersAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/contact" element={
            <ProtectedRoute requireAdmin={true}><ContactAdmin /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App