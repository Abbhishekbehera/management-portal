import user from '../models/user.js'
//For Authentication Modules
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'


dotenv.config()

//Secret Key
const secret_key = process.env.SECRET

//Register Controller
export const register = async (req, res) => {
    console.log(req.body)
    const { name, email, password, school, role } = req.body
    const existingEmail = await user.findOne({ email })
    try {
        if (existingEmail) {
            res.status(403).json({ data: 'User already exists.' })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new user({
            name,
            email,
            password: hashPassword,
            school,
            role
        })
        await newUser.save()
        console.log(newUser)
        res.status(201).json({ data: 'User created successfully.' })
    }
    catch (e) {
        return res.status(500).json({ e: "Server is down." })
    }
}

//Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExists = await user.findOne({ email })
        if (!userExists) {
            return res.status(404).json({ data: 'Invalid user email.' })
        }
        const checkPassword = await bcrypt.compare(password, userExists.password)
        if (!checkPassword) {
            return res.status(401).json({ data: 'Invalid password.' })
        }
        const token = jwt.sign({
            email: userExists.email,
        }, secret_key, { expiresIn: '5h' })
        res.status(202).json({ token })
    }
    catch (e) {
        return res.status(500), json({ e: "Server is down." })
    }
}


