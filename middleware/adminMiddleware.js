const jwt = require("jsonwebtoken");
const adminMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");  
    if (!authHeader) {
        return res.status(403).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];  
    if (!token) {
        return res.status(403).json({ message: "Access Denied. Token is missing." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Yetkisiz ERİŞİM" })
        }
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Geçersiz token!' });
    }

}
module.exports = adminMiddleware;
