const User = require("../models/user")
const Blog = require("../models/blogs")
const Category = require("../models/category")
const Comment = require("../models/comment")
const Complaint = require("../models/complaint");

module.exports.createComplaintForBlog = async (req, res) => {
    const blogID = req.params.id
    const { description, title } = req.body
    const user = req.user;
    console.log("USER COMPLAİNT", user);


    try {
        const newComplaint = new Complaint({
            user: user.id,
            title,
            description,
            reportedBlogs: [blogID]

        })
        await newComplaint.save();
        res.status(200).json({ msg: "Şikayetiniz Oluşturuldu ", complaint: newComplaint })
    } catch (error) {
        console.error("Şikayet oluşturulurken bir hata oluştu:", error);
        res.status(500).json({
            message: 'Şikayet oluşturulurken bir hata oluştu.',
            error: error.message,
        });
    }
}
module.exports.createComplaintForComment = async (req, res) => {
    const commentID = req.params.id;
    const { description, title } = req.body
    const user = req.user

    try {
        const newComplaint = new Complaint({
            user: user.id,
            title,
            description,
            reportedComments: [commentID]
        })
        await newComplaint.save();
        res.status(200).json({ msg: "Şikayetiniz Oluşturuldu ", complaint: newComplaint })
    } catch (error) {
        console.error("Şikayet oluşturulurken bir hata oluştu:", error);
        res.status(500).json({
            message: 'Şikayet oluşturulurken bir hata oluştu.',
            error: error.message,
        });
    }
}

module.exports.createComplaintForUser=async (req,res) => {
    const userID = req.params.id;
    const { description, title } = req.body
    const user = req.user

    try {
        const newComplaint = new Complaint({
            user: user.id,
            title,
            description,
            reportedUsers:[userID]
        })
        await newComplaint.save();
        res.status(200).json({ msg: "Şikayetiniz Oluşturuldu ", complaint: newComplaint })
    } catch (error) {
        console.error("Şikayet oluşturulurken bir hata oluştu:", error);
        res.status(500).json({
            message: 'Şikayet oluşturulurken bir hata oluştu.',
            error: error.message,
        });
    }
}