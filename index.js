const express = require("express");
const path = require("path")
const userRoutes = require("./routes/userRoute")
const blogRoutes = require("./routes/blogRoute")
const adminRoutes = require("./routes/admin/adminRoute")
require('dotenv').config(); // .env dosyasını yükle
const cors = require('cors');
const mongoose = require("mongoose")
const app = express();
app.use(express.json())
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware'ler
app.use("/admin", adminRoutes)
app.use("/users", userRoutes)
    // CORS politikasını ayarlar
    ; // JSON formatındaki istekleri anlamak için

app.use("/blog", blogRoutes)



// MongoDB'ye bağlan


mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB bağlandı'))
    .catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Hello from server!');
});

// const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
