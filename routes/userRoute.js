const express = require("express");
const { getBlogs, createBlog } = require("../controller/blogs");
const { getUser, registerUser, login, getUserById, updateUserProfile, follow } = require("../controller/user");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { createComplaintForBlog, createComplaintForComment, createComplaintForUser } = require("../controller/complaint");
const router = express.Router();

//KULLANICI KAYIT İŞLEMLERİ
router.get("/", getUser)
router.post("/register", registerUser)
router.post("/login", login)
router.get("/user/:id", getUserById)
router.put('/update/:id', upload.single('profilePicture'), updateUserProfile);
router.put("/user/follow/:id", authMiddleware, follow);

//ŞİKAYET 
router.post("/complaintForBlog/:id", authMiddleware, createComplaintForBlog);
router.post("/complaintForComment/:id", authMiddleware, createComplaintForComment);
router.post("/complaintForUser/:id", authMiddleware, createComplaintForUser)


module.exports = router
