import Notification from '../models/Notification.js'
import httpError from '../utils/httpError.js'
export async function listNotifications(req,res,next){try{res.json({notifications:await Notification.find({user:req.user.userId}).sort({createdAt:-1}).limit(100).lean()})}catch(error){next(error)}}
export async function readNotification(req,res,next){try{const notification=await Notification.findOneAndUpdate({_id:req.params.id,user:req.user.userId},{read:true},{new:true});if(!notification)throw httpError(404,'Notification not found.');res.json({notification})}catch(error){next(error)}}
export async function readAllNotifications(req,res,next){try{await Notification.updateMany({user:req.user.userId,read:false},{read:true});res.json({message:'Notifications marked as read.'})}catch(error){next(error)}}
