import Donation from '../models/Donation.js'
import Need from '../models/Need.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'
import httpError from '../utils/httpError.js'

const notifyIfEnabled = async notification => {if(await User.exists({_id:notification.user,notificationsEnabled:{$ne:false}}))await Notification.create(notification)}

export async function createDonation(req,res,next){try{
  const need=await Need.findOne({_id:req.body.need,verificationStatus:'Verified'})
  if(!need) throw httpError(404,'This verified need is no longer available.')
  if(String(need.submittedBy)===req.user.userId) throw httpError(400,'You cannot offer help on your own request.')
  const quantity=Number(req.body.quantity)
  if(!Number.isInteger(quantity)||quantity<1) throw httpError(400,'Please enter a valid quantity.')
  const outstanding=need.quantityNeeded-need.quantityFulfilled
  if(outstanding<=0) throw httpError(409,'This need has already been fulfilled.')
  if(quantity>outstanding) throw httpError(409,`Only ${outstanding} item${outstanding===1?' is':'s are'} still needed.`)
  const donation=await Donation.create({need:need._id,donor:req.user.userId,itemName:need.title,category:need.category,description:req.body.description,condition:req.body.condition,quantity,location:req.body.location,status:'Offered'})
  await notifyIfEnabled({user:need.submittedBy,title:'A helper responded',message:`A community member offered help with “${need.title}”.`,link:'/my-requests'})
  res.status(201).json({donation})
}catch(error){next(error)}}

export async function myDonations(req,res,next){try{res.json({donations:await Donation.find({donor:req.user.userId}).populate('need','title location urgency verificationStatus').sort({createdAt:-1}).lean()})}catch(error){next(error)}}

export async function receivedDonations(req,res,next){try{const needs=await Need.find({submittedBy:req.user.userId}).select('_id');res.json({donations:await Donation.find({need:{$in:needs.map(need=>need._id)}}).populate('need','title verificationStatus submittedBy').populate('donor','name').sort({createdAt:-1}).lean()})}catch(error){next(error)}}

export async function getDonation(req,res,next){try{const donation=await Donation.findById(req.params.id).populate('need','title location urgency verificationStatus submittedBy').populate('donor','name');if(!donation)throw httpError(404,'Donation not found.');const owner=String(donation.donor?._id)===req.user.userId;const requester=String(donation.need?.submittedBy)===req.user.userId;if(!owner&&!requester&&req.user.role!=='admin')throw httpError(403,'You do not have permission to view this donation.');res.json({donation})}catch(error){next(error)}}

export async function updateDonation(req,res,next){try{
  const donation=await Donation.findById(req.params.id).populate('need')
  if(!donation)throw httpError(404,'Donation not found.')
  const owner=String(donation.donor)===req.user.userId
  const requester=String(donation.need?.submittedBy)===req.user.userId
  const admin=req.user.role==='admin'
  const nextStatus=req.body.status
  const validTransitions={Offered:['Matched','Declined','Cancelled'],Matched:['Coordinating'],Coordinating:['Completed']}
  if(!validTransitions[donation.status]?.includes(nextStatus))throw httpError(409,'That status transition is not permitted.')
  const allowed=admin||(['Matched','Declined'].includes(nextStatus)?requester:nextStatus==='Cancelled'||['Coordinating','Completed'].includes(nextStatus)?owner:false)
  if(!allowed)throw httpError(403,'That status change is not permitted.')
  if(donation.status==='Offered'&&nextStatus==='Matched'){
    const need=await Need.findById(donation.need?._id||donation.need).select('quantityNeeded quantityFulfilled')
    if(!need)throw httpError(404,'Help request not found.')
    const commitments=await Donation.aggregate([{$match:{need:need._id,_id:{$ne:donation._id},status:{$in:['Matched','Coordinating']}}},{$group:{_id:null,quantity:{$sum:'$quantity'}}}])
    const remaining=need.quantityNeeded-need.quantityFulfilled-(commitments[0]?.quantity||0)
    if(donation.quantity>remaining)throw httpError(409,'This offer exceeds the quantity still available for matching.')
  }
  const updates={status:nextStatus}
  if(req.body.handoverNotes!==undefined)updates.handoverNotes=req.body.handoverNotes
  const updatedDonation=await Donation.findOneAndUpdate({_id:donation._id,status:donation.status},updates,{new:true,runValidators:true}).populate('need')
  if(!updatedDonation)throw httpError(409,'This donation changed before your update was completed. Please try again.')
  if(requester&&['Matched','Declined'].includes(nextStatus))await notifyIfEnabled({user:updatedDonation.donor,title:nextStatus==='Matched'?'Offer accepted':'Offer update',message:nextStatus==='Matched'?`Your offer for “${updatedDonation.need.title}” was accepted. You can now coordinate the handover.`:`Your offer for “${updatedDonation.need.title}” was not selected.`,link:'/my-donations'})
  if(nextStatus==='Coordinating'&&updatedDonation.need)await notifyIfEnabled({user:updatedDonation.need.submittedBy,title:'Handover coordination started',message:`A helper has started coordinating the handover for “${updatedDonation.need.title}”.`,link:'/my-requests'})
  if(nextStatus==='Completed'&&updatedDonation.need){
    updatedDonation.need.quantityFulfilled=Math.min(updatedDonation.need.quantityNeeded,updatedDonation.need.quantityFulfilled+updatedDonation.quantity)
    const fulfilled=updatedDonation.need.quantityFulfilled>=updatedDonation.need.quantityNeeded
    if(fulfilled)updatedDonation.need.verificationStatus='Fulfilled'
    await updatedDonation.need.save()
    await notifyIfEnabled({user:updatedDonation.need.submittedBy,title:fulfilled?'Request fulfilled':'Handover completed',message:fulfilled?`The completed handover fulfilled your request “${updatedDonation.need.title}”.`:`A helper completed the handover for “${updatedDonation.need.title}”.`,link:'/my-requests'})
  }
  res.json({donation:updatedDonation})
}catch(error){next(error)}}
