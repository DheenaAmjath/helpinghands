import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectDatabase } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import needRoutes from './routes/needRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const serverDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: resolve(serverDirectory, '.env') })

const required = ['MONGODB_URI', 'JWT_SECRET']
const missing = required.filter((key) => !process.env[key]?.trim())
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(', ')}`)
  console.error(`Create ${resolve(serverDirectory, '.env')} from server/.env.example.`)
  process.exit(1)
}
const app=express();app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));app.use(express.json({limit:'1mb'}));app.get('/api/health',(req,res)=>res.json({status:'ok'}));app.use('/api/auth',authRoutes);app.use('/api/needs',needRoutes);app.use('/api/donations',donationRoutes);app.use('/api/notifications',notificationRoutes);app.use('/api/dashboard',dashboardRoutes);app.use('/api/admin',adminRoutes);app.use(notFound);app.use(errorHandler)
const port=Number(process.env.PORT)||8000
connectDatabase().then(()=>app.listen(port,()=>console.log(`Helping Hands API running on http://localhost:${port}`))).catch(error=>{console.error('MongoDB connection failed:',error.message);process.exit(1)})
