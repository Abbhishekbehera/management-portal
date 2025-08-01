import jwt from 'jsonwebtoken'

dotenv.config()

//Secret Key
const secret_key = process.env.SECRET

//Authentication Middleware
const authMiddleware = async (req, res) => {
    const token = req.headers.authorization?.spilt(" ")[1]
    if (!token) {
        return res.status(403).json({ data: 'Authentication Error.' })
    }
    try {
        const userExists = jwt.verify(token, secret_key)
        req.user = userExists
        next()

    }
    catch (e) {
        return res.status(500).json({ e: 'Server is down.' })
    }
}

export default authMiddleware