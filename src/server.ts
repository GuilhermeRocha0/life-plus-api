import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { setupSwagger } from './swagger'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import examRoutes from './routes/examRoutes'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/exams', examRoutes)

setupSwagger(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
