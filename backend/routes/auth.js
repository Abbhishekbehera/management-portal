import express from 'express'
//Login and Register Controller Module
import { login, register } from '../controllers/authController.js'

const authRouter = express.Router()

//Login Router
authRouter.post('/login', login)
authRouter.post('/register', register)

export default authRouter