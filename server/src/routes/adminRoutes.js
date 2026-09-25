import { Router } from 'express'
import { adminStats, listRequests, listUsers, reports, updateUser } from '../controllers/adminController.js'
import { allowRoles, requireAuth } from '../middleware/auth.js'
const router=Router();router.use(requireAuth,allowRoles('admin'));router.get('/stats',adminStats);router.get('/users',listUsers);router.patch('/users/:id',updateUser);router.get('/requests',listRequests);router.get('/reports',reports);export default router
