import Donation from '../models/Donation.js'
import Need from '../models/Need.js'
import Notification from '../models/Notification.js'
export async function getDashboard(req,res,next){try{const [donations,requests,verifiedNeeds,matches,unreadNotifications]=await Promise.all([Donation.countDocuments({donor:req.user.userId}),Need.countDocuments({submittedBy:req.user.userId}),Need.countDocuments({verificationStatus:'Verified'}),Donation.countDocuments({donor:req.user.userId,status:{$in:['Matched','Coordinating']}}),Notification.countDocuments({user:req.user.userId,read:false})]);res.json({donations,requests,verifiedNeeds,matches,unreadNotifications})}catch(error){next(error)}}
