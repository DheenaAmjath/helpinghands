import { Router } from 'express'
import { cancelNeed, createNeed, getNeed, getSupportingProof, listVerifiedNeeds, myNeeds, reviewNeed, updateNeed, verificationQueue } from '../controllers/needsController.js'
import { allowRoles, optionalAuth, requireAuth } from '../middleware/auth.js'
import { uploadSupportingProofs } from '../middleware/proofUpload.js'
const router=Router()
router.get('/',listVerifiedNeeds)
router.get('/mine',requireAuth,allowRoles('requester','community'),myNeeds)
router.get('/verification-queue',requireAuth,allowRoles('admin'),verificationQueue)
router.post('/',requireAuth,allowRoles('requester','community'),uploadSupportingProofs,createNeed)
router.get('/:id/proofs/:proofId',requireAuth,allowRoles('requester','community','admin'),getSupportingProof)
router.get('/:id',optionalAuth,getNeed)
router.patch('/:id',requireAuth,allowRoles('requester','community'),updateNeed)
router.delete('/:id',requireAuth,allowRoles('requester','community'),cancelNeed)
router.patch('/:id/review',requireAuth,allowRoles('admin'),reviewNeed)
export default router
