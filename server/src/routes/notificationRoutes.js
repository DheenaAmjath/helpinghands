import { Router } from 'express'
import { listNotifications, readAllNotifications, readNotification } from '../controllers/notificationsController.js'
import { requireAuth } from '../middleware/auth.js'
const router=Router();router.use(requireAuth);router.get('/',listNotifications);router.patch('/read-all',readAllNotifications);router.patch('/:id/read',readNotification);export default router
