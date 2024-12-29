const multer = require('multer');
const path = require('path');

// Dosya yükleme için multer konfigürasyonu
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Resimlerin kaydedileceği dizin
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Dosya adı
    }
});

const upload = multer({ storage: storage }); // Multer konfigürasyonunu tanımlıyoruz

module.exports = upload;
