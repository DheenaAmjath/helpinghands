import jwt from 'jsonwebtoken'
import User from '../models/User.js'
export async function requireAuth(req,res,next){const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):null;if(!token)return res.status(401).json({message:'Authentication required.'});try{const payload=jwt.verify(token,process.env.JWT_SECRET);const user=await User.findById(payload.userId).select('role active').lean();if(!user||user.active===false)return res.status(401).json({message:'This account is unavailable.'});req.user={userId:String(user._id),role:user.role};next()}catch{return res.status(401).json({message:'Invalid or expired token.'})}}
export const allowRoles=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'You do not have permission to access this resource.'})

export async function optionalAuth(req,res,next) {
  const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):null
  if(!token) return next()
  let payload
  try { payload=jwt.verify(token,process.env.JWT_SECRET) } catch { req.user=null; return next() }
  try {
    const user=await User.findById(payload.userId).select('role active').lean()
    req.user=user&&user.active!==false?{userId:String(user._id),role:user.role}:null
    return next()
  } catch(error) { return next(error) }
}
