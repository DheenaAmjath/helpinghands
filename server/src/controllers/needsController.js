import { findPublicVerifiedNeeds } from '../services/needService.js'
import Need from '../models/Need.js'
import Donation from '../models/Donation.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'
import httpError from '../utils/httpError.js'
import { removeStoredProofs, resolveStoredProof, storedProofIsAvailable, storeSupportingProofs } from '../services/proofStorage.js'

const editable = ['title','description','category','location','urgency','quantityNeeded']
const safePublicFields = 'title description category location urgency quantityNeeded quantityFulfilled verificationStatus createdAt'
const notifyIfEnabled = async notification => {if(await User.exists({_id:notification.user,notificationsEnabled:{$ne:false}}))await Notification.create(notification)}
const safeNeed = need => {const result=typeof need.toObject==='function'?need.toObject():need;if(result.supportingProofs)result.supportingProofs=result.supportingProofs.map(({storageKey,...proof})=>proof);return result}

export async function listVerifiedNeeds(req,res,next) {
  try {
    const needs = await findPublicVerifiedNeeds()
    res.status(200).json({needs})
  } catch (error) {
    next(error)
  }
}

export async function getNeed(req,res,next) {
  try {
    const need=await Need.findById(req.params.id).populate('submittedBy','name')
    if(!need) throw httpError(404,'Help request not found.')
    const isPrivileged=req.user&&(['admin','community'].includes(req.user.role)||String(need.submittedBy?._id)===req.user.userId)
    const canViewProof=req.user&&(req.user.role==='admin'||String(need.submittedBy?._id)===req.user.userId)
    if(need.verificationStatus!=='Verified'&&!isPrivileged) throw httpError(404,'Help request not found.')
    const result=safeNeed(need)
    if(!isPrivileged){delete result.reviewerNotes;if(result.submittedBy)delete result.submittedBy.name}
    if(!canViewProof)delete result.supportingProofs
    res.json({need:result})
  } catch(error){next(error)}
}

export async function myNeeds(req,res,next) {
  try { const needs=await Need.find({submittedBy:req.user.userId}).sort({createdAt:-1}).lean();res.json({needs:needs.map(safeNeed)}) } catch(error){next(error)}
}

export async function createNeed(req,res,next) {
  let need
  try {
    if(!req.files?.length)throw httpError(400,'Please upload at least one supporting proof document.')
    if(!req.body||typeof req.body!=='object'||Array.isArray(req.body))throw httpError(400,'Help request details are required.')
    const payload={submittedBy:req.user.userId}
    for(const key of editable) payload[key]=req.body[key]
    need=new Need(payload)
    need.supportingProofs=await storeSupportingProofs(req.files,need._id)
    await need.save()
    res.status(201).json({need:safeNeed(need)})
  } catch(error){if(need)await removeStoredProofs(need._id);next(error)}
}

export async function getSupportingProof(req,res,next) {
  try {
    const need=await Need.findById(req.params.id).select('submittedBy supportingProofs')
    if(!need)throw httpError(404,'Help request not found.')
    if(req.user.role!=='admin'&&String(need.submittedBy)!==req.user.userId)throw httpError(403,'You do not have permission to view this supporting proof.')
    const proof=need.supportingProofs.id(req.params.proofId)
    if(!proof)throw httpError(404,'Supporting proof not found.')
    if(!await storedProofIsAvailable(proof))throw httpError(404,'Supporting proof file is unavailable.')
    res.set('Cache-Control','private, no-store')
    res.type(proof.mimeType)
    res.download(resolveStoredProof(proof.storageKey),proof.originalName,error=>{if(error&&!res.headersSent)next(error)})
  } catch(error){next(error)}
}

export async function updateNeed(req,res,next) {
  try {
    const need=await Need.findOne({_id:req.params.id,submittedBy:req.user.userId})
    if(!need) throw httpError(404,'Help request not found.')
    if(!['Pending Verification','Rejected'].includes(need.verificationStatus)) throw httpError(409,'Only pending or rejected requests can be edited.')
    for(const key of editable) if(req.body[key]!==undefined) need[key]=req.body[key]
    need.verificationStatus='Pending Verification';need.reviewerNotes=undefined;need.reviewedBy=undefined;need.reviewedAt=undefined
    await need.save();res.json({need})
  } catch(error){next(error)}
}

export async function cancelNeed(req,res,next) {
  try {
    const need=await Need.findOne({_id:req.params.id,submittedBy:req.user.userId})
    if(!need) throw httpError(404,'Help request not found.')
    if(['Fulfilled','Cancelled'].includes(need.verificationStatus)) throw httpError(409,'This request cannot be cancelled.')
    need.verificationStatus='Cancelled';await need.save()
    await Donation.updateMany({need:need._id,status:{$nin:['Completed','Cancelled']}},{status:'Cancelled'})
    res.json({need})
  } catch(error){next(error)}
}

export async function reviewNeed(req,res,next) {
  try {
    const {decision,notes=''}=req.body
    if(!['Verified','Rejected'].includes(decision)) throw httpError(400,'Decision must be Verified or Rejected.')
    const need=await Need.findById(req.params.id)
    if(!need) throw httpError(404,'Help request not found.')
    if(['Fulfilled','Cancelled'].includes(need.verificationStatus)) throw httpError(409,'This request can no longer be reviewed.')
    if(decision==='Verified'){
      let hasValidProof=false
      for(const proof of need.supportingProofs||[])if(await storedProofIsAvailable(proof)){hasValidProof=true;break}
      if(!hasValidProof)throw httpError(409,'At least one valid supporting proof is required before verification.')
    }
    need.verificationStatus=decision;need.reviewerNotes=notes;need.reviewedBy=req.user.userId;need.reviewedAt=new Date();await need.save()
    await notifyIfEnabled({user:need.submittedBy,title:`Request ${decision.toLowerCase()}`,message:decision==='Verified'?`Your request “${need.title}” is now visible to helpers.`:`Your request “${need.title}” needs changes before it can be published.`,link:'/my-requests'})
    res.json({need})
  } catch(error){next(error)}
}

export async function verificationQueue(req,res,next) {
  try {
    const history=req.query.history==='true'
    const filter=history?{reviewedBy:req.user.userId,verificationStatus:{$in:['Verified','Rejected']}}:{verificationStatus:{$in:['Pending Verification','Under Review']}}
    const needs=await Need.find(filter).select(safePublicFields+' reviewerNotes reviewedAt').populate('submittedBy','name').sort({createdAt:history?-1:1}).lean()
    res.json({needs})
  } catch(error){next(error)}
}
