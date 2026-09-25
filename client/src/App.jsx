import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import AvailableNeeds from './pages/Needs/AvailableNeeds.jsx'
import NeedDetails from './pages/Needs/NeedDetails.jsx'
import MyRequests from './pages/Requests/MyRequests.jsx'
import MyDonations from './pages/Donations/MyDonations.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Profile/Settings.jsx'
import Notifications from './pages/Notifications/Notifications.jsx'
import ReviewerDashboard from './pages/Reviewer/ReviewerDashboard.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import RoleRoute from './components/common/RoleRoute.jsx'
import './App.css'

function ScrollToSection() {
  const {hash, pathname} = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo({top: 0})
  }, [hash, pathname])
  return null
}

export default function App() {
  return <div className="app"><ScrollToSection/><Navbar /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/how-it-works" element={<Navigate to="/home#how" replace />} />
    <Route path="/verified-needs" element={<Navigate to="/home#needs" replace />} />
    <Route path="/about" element={<Navigate to="/home#trust" replace />} />
    <Route path="/safety" element={<Navigate to="/home#trust" replace />} />
    <Route path="/privacy" element={<Navigate to="/home#trust" replace />} />
    <Route path="/community-review" element={<Navigate to="/home#trust" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/my-requests" element={<RoleRoute roles={['requester','community']}><MyRequests /></RoleRoute>} />
    <Route path="/available-needs" element={<ProtectedRoute><AvailableNeeds /></ProtectedRoute>} />
    <Route path="/available-needs/:id" element={<ProtectedRoute><NeedDetails /></ProtectedRoute>} />
    <Route path="/my-donations" element={<RoleRoute roles={['donor']}><MyDonations /></RoleRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="/reviewer" element={<RoleRoute roles={['admin']}><ReviewerDashboard /></RoleRoute>} />
    <Route path="/reviewer/verifications" element={<Navigate to="/reviewer" replace />} />
    <Route path="/reviewer/history" element={<RoleRoute roles={['admin']}><ReviewerDashboard /></RoleRoute>} />
    <Route path="/admin/*" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes><Footer /></div>
}
