import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const publicUser = (user) => ({id:user._id,name:user.name,email:user.email,role:user.role,location:user.location||'',bio:user.bio||'',notificationsEnabled:user.notificationsEnabled!==false})
const tokenFor = (user) => jwt.sign({userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'7d'})
export async function registerUser({name,email,password,role}) {
  const normalizedEmail=email.trim().toLowerCase()
  if(await User.exists({email:normalizedEmail})) { const error=new Error('An account already exists for this email.'); error.status=409; throw error }
  const allowed=['donor','requester','community']; const passwordHash=await bcrypt.hash(password,12)
  const user=await User.create({name:name.trim(),email:normalizedEmail,password:passwordHash,role:allowed.includes(role)?role:'donor'})
  return {token:tokenFor(user),user:publicUser(user)}
}
export async function loginUser({email,password}) {
  const user=await User.findOne({email:email.trim().toLowerCase()}).select('+password')
  if(!user || !(await bcrypt.compare(password,user.password))) { const error=new Error('Invalid email or password.'); error.status=401; throw error }
  if(user.active===false) { const error=new Error('This account has been disabled.'); error.status=403; throw error }
  return {token:tokenFor(user),user:publicUser(user)}
}
