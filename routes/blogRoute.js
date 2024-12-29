const express = require("express");
const { getBlogs, createBlog, createCategory, getCategory, getBlog, getBlogById, deleteBlogById, isArchiveSet, likeAdd, addComment, allBlog, followingBlogs } = require("../controller/blogs");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();



//BLOG İŞLEMLERİ

router.post("/createBlog", upload.single('image'), authMiddleware, createBlog);
router.post("/createCategory", authMiddleware, adminMiddleware, createCategory)
router.get("/getCategory", getCategory)
router.get("/getBlog", getBlog)
router.get("/allBlog",allBlog);
router.get("/blog/:id", getBlogById);
router.delete("/blog/delete/:id", authMiddleware, deleteBlogById);
router.patch("/blog/archive/:id", authMiddleware, isArchiveSet);
router.put("/blog/like/:id", authMiddleware, likeAdd);
router.post("/blog/comment/:id", authMiddleware, addComment);
router.get("/getFollowingBLogs",authMiddleware,followingBlogs);


module.exports = router
