import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ChatBot from './ChatBot.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
