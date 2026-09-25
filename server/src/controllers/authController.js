import { loginUser, registerUser } from '../services/authService.js'
import User from '../models/User.js'
export async function register(req,res,next){try{res.status(201).json(await registerUser(req.body))}catch(error){next(error)}}
export async function login(req,res,next){try{res.json(await loginUser(req.body))}catch(error){next(error)}}
const safeUser = user => ({id:user._id,name:user.name,email:user.email,role:user.role,location:user.location||'',bio:user.bio||'',notificationsEnabled:user.notificationsEnabled!==false})
export async function me(req,res,next){try{const user=await User.findById(req.user.userId);if(!user)return res.status(404).json({message:'User not found.'});res.json({user:safeUser(user)})}catch(error){next(error)}}
export async function updateMe(req,res,next){try{const updates={};for(const key of ['name','location','bio','notificationsEnabled'])if(req.body[key]!==undefined)updates[key]=req.body[key];const user=await User.findByIdAndUpdate(req.user.userId,updates,{new:true,runValidators:true});if(!user)return res.status(404).json({message:'User not found.'});res.json({user:safeUser(user)})}catch(error){next(error)}}
