import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Chatbot from './Chatbot'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-vision-dark bg-grid-pattern">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}