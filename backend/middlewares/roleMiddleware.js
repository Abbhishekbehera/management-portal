const authorizeRoles = (...allowRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !allowRoles.includes(req.user.role)) {
                return res.status(403).json({ data: 'Invalid authorization role.' })
            }
            next()
        }
        catch (e) {
            console.log(e.message)
            return res.status(500).json({ err: e.message, data: 'Server is down.' })
        }
    }
}

export default authorizeRoles