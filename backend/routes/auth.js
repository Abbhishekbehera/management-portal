import express from 'express'
import authorizeRoles from '../middlewares/roleMiddleware.js'
//Login and Register Controllers
import {
    login,
    register
} from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const authRouter = express.Router()

//Authentication Management
authRouter.post('/login', authMiddleware, authorizeRoles('admin', 'teacher'), login)

authRouter.post('/register', register)

export default authRouter