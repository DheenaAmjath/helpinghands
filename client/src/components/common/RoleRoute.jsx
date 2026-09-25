import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Loading from './Loading.jsx'

export default function RoleRoute({roles,children}) {
  const {user,loading}=useAuth()
  if(loading) return <Loading/>
  if(!user) return <Navigate to="/login" state={{authenticationRequired:true}} replace/>
  return roles.includes(user.role)?children:<Navigate to="/dashboard" replace/>
}
