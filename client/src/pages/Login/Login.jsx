import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const [form,setForm] = useState({email:'',password:''}); const [error,setError] = useState(''); const [saving,setSaving] = useState(false); const {login} = useAuth(); const navigate=useNavigate(); const location=useLocation()
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { await login(form); navigate(location.state?.from?.pathname || '/dashboard', {replace:true}) } catch (err) { setError(err.response?.data?.message || 'Unable to log in. Please check your details.') } finally { setSaving(false) } }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><p className="eyebrow">SECURE MEMBER ACCESS</p><h1>Welcome back</h1><p>Manage your donations, requests, matches and impact.</p>{location.state?.authenticationRequired && <div className="message">Please log in or create an account to continue.</div>}{error && <div className="message error">{error}</div>}<Input label="Email address" type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><Input label="Password" type="password" autoComplete="current-password" required minLength="8" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><Button disabled={saving}>{saving?'Logging in…':'Login'}</Button><small>New to Helping Hands? <Link to="/register" state={{from: location.state?.from}}>Create an account</Link></small></form></main>
}
