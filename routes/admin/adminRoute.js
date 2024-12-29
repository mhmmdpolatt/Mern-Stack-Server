const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");
const adminMiddleware = require("../../middleware/adminMiddleware");
const { getUser } = require("../../controller/user");
const { deleteUser, deleteBlogForAdmin, updateUserRole, deleteComment, fetchComplaint, complaintResolved, complaintRejected, complaintExamine, deleleteComplaint } = require("../../controller/admin");

const router = express.Router();

router.get("/fetchUser", adminMiddleware, getUser);

router.delete("/deleteUser/:id", adminMiddleware, deleteUser);

router.delete("/deleteBlog/:id", adminMiddleware, deleteBlogForAdmin);

router.patch("/updateUserRole/:id", adminMiddleware, updateUserRole);

router.patch("/complaint/changeStatusResolved/:resolved", adminMiddleware, complaintResolved);

router.patch("/complaint/changeStatusRejected/:rejected", adminMiddleware, complaintRejected);
router.patch("/complaint/changeStatusExamine/:examine", adminMiddleware, complaintExamine);
router.delete("/complaint/delete/:id",adminMiddleware,deleleteComplaint);

router.delete("/deleteComment/:id", adminMiddleware, deleteComment);

router.get("/fetchComplaint", adminMiddleware, fetchComplaint);




module.exports = router
