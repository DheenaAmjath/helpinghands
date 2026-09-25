import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const roles = [['donor','♡','Donor'],['requester','◇','Requester'],['community','✓','Community representative']]
export default function Register() {
  const [params] = useSearchParams(); const initialRole = roles.some(([role])=>role===params.get('role')) ? params.get('role') : 'donor'; const [form,setForm] = useState({name:'',email:'',password:'',role:initialRole}); const [error,setError] = useState(''); const [saving,setSaving] = useState(false); const {register} = useAuth(); const navigate=useNavigate(); const location=useLocation()
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { await register(form); navigate(location.state?.from?.pathname || '/dashboard',{replace:true}) } catch (err) { setError(err.response?.data?.message || 'Unable to create your account.') } finally { setSaving(false) } }
  return <main className="auth-page"><form className="auth-card wide" onSubmit={submit}><p className="eyebrow">JOIN THE NETWORK</p><h1>Create your account</h1><p>Choose how you will take part in Helping Hands.</p><div className="role-options">{roles.map(([role,icon,label])=><label className={form.role===role?'selected':''} key={role}><input type="radio" name="role" value={role} checked={form.role===role} onChange={e=>setForm({...form,role:e.target.value})}/><span>{icon}</span><strong>{label}</strong></label>)}</div>{error&&<div className="message error">{error}</div>}<Input label="Full name" autoComplete="name" required minLength="2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><Input label="Email address" type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><Input label="Password" type="password" autoComplete="new-password" required minLength="8" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><Button disabled={saving}>{saving?'Creating account…':'Register securely'}</Button><small>Already registered? <Link to="/login">Login</Link></small></form></main>
}
