import { Router } from 'express'
import { createDonation, getDonation, myDonations, receivedDonations, updateDonation } from '../controllers/donationsController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'
const router=Router();router.use(requireAuth);router.get('/',allowRoles('donor'),myDonations);router.get('/received',allowRoles('requester','community'),receivedDonations);router.post('/',allowRoles('donor'),createDonation);router.get('/:id',allowRoles('donor','requester','community','admin'),getDonation);router.patch('/:id',allowRoles('donor','requester','community','admin'),updateDonation);export default router
