import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false); const {user, logout} = useAuth(); const navigate = useNavigate()
  const close = () => setOpen(false)
  return <header className="navbar"><Link className="brand" to="/" onClick={close}><span>H</span><div><strong>Helping Hands</strong><small>Verified Giving Network</small></div></Link>
    <button className="menu-button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
    <nav className={open ? 'nav-links open' : 'nav-links'}>{[['/','Home'],['/#how','How it works'],['/#needs','Verified needs']].map(([to,label]) => <NavLink key={label} to={to} onClick={close}>{label}</NavLink>)}
      {user ? <>{user.role!=='admin'&&<NavLink to="/available-needs" onClick={close}>Available needs</NavLink>}<NavLink to={user.role==='admin'?'/admin':'/dashboard'} onClick={close}>{user.role==='admin'?'Admin':'Dashboard'}</NavLink>{user.role!=='admin'&&<NavLink to="/notifications" onClick={close} aria-label="Notifications">◉</NavLink>}<button onClick={() => {logout(); close(); navigate('/')}}>Logout</button></> : <><NavLink to="/login" onClick={close}>Login</NavLink><NavLink className="nav-cta" to="/register" onClick={close}>Register</NavLink></>}
    </nav></header>
}
