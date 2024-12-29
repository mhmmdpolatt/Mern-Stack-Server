const jwt = require('jsonwebtoken');

// Token doğrulama middleware'i
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");  // Authorization header'ını alıyoruz
  if (!authHeader) {
    return res.status(403).json({ message: "Erişim Reddedildi. Token sağlanmadı." });
  }

  const token = authHeader.split(" ")[1];  // "Bearer token" kısmından token'ı alıyoruz
  if (!token) {
    return res.status(403).json({ message: "Access Denied. Token is missing." });
  }

  // Token'ı doğrulama
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // console.log(err)
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;  // Token'dan alınan kullanıcı bilgilerini req.user'a ekliyoruz
    next();  // Middleware işlemini sonlandırıp bir sonraki işlemi başlatıyoruz
  });
};

module.exports = authenticateToken;
