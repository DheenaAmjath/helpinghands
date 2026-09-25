import { Router } from 'express'
import { login, me, register, updateMe } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { validateAuth } from '../middleware/validate.js'
const router=Router();router.post('/register',validateAuth,register);router.post('/login',validateAuth,login);router.get('/me',requireAuth,me);router.patch('/me',requireAuth,updateMe);export default router
