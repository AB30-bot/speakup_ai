import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NavBar } from './components/ui/NavBar'
import { Landing } from './pages/Landing'
import { Scenarios } from './pages/Scenarios'
import { Conversation } from './pages/Conversation'
import { Report } from './pages/Report'
import { Dashboard } from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/conversation" element={<Conversation />} />
        <Route path="/report" element={<Report />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
