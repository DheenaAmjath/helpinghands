import { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../services/api.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!localStorage.getItem('helpingHandsToken')) return setLoading(false)
    authAPI.me().then(({data}) => setUser(data.user)).catch(() => localStorage.removeItem('helpingHandsToken')).finally(() => setLoading(false))
  }, [])
  const saveSession = ({token, user: account}) => { localStorage.setItem('helpingHandsToken', token); setUser(account) }
  const login = async (values) => { const {data} = await authAPI.login(values); saveSession(data); return data }
  const register = async (values) => { const {data} = await authAPI.register(values); saveSession(data); return data }
  const updateProfile = async (values) => { const {data} = await authAPI.updateMe(values); setUser(data.user); return data.user }
  const logout = () => { localStorage.removeItem('helpingHandsToken'); setUser(null) }
  return <AuthContext.Provider value={{user, loading, login, register, updateProfile, logout}}>{children}</AuthContext.Provider>
}
