const User = require("../models/user");
const Blog = require("../models/blogs");
const Comment = require("../models/comment");
const Category = require("../models/category");
const Complaint = require("../models/complaint");


module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        //KUlLANICIN TÜM BLOGLARI SİLİNİYOR
        await Blog.deleteMany({ user: id });
        //KULLANICININ TÜM YORUMLARI SİLİNİYOR
        await Comment.deleteMany({ user: id });

        //KULLANICI SİLİNİYOR
        const deletedUser = await User.findByIdAndDelete(id).populate('blogs likes'); // Kullanıcıyla ilişkili tüm bilgiler silinir.
        if (!deletedUser) {
            return res.status(404).json({ msg: "KULLANICI BULUNAMADI" })
        }
        res.status(200).json({ msg: "KULLANICI BAŞARIYLA SİLİNDİ" })
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error });
        console.log(error);

    }
}

module.exports.deleteBlogForAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        // Tüm yorumları sil
        await Comment.deleteMany({ blog: id });

        // Kullanıcıların blogs alanındaki ilgili blogu sil
        await User.updateMany(
            { "blogs": id },
            { $pull: { blogs: id } }
        );

        // Blogu sil
        await Blog.findByIdAndDelete(id).populate("comment");

        res.status(200).json({ message: 'Blog başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Silme işlemi sırasında bir hata oluştu.', error });
        console.log("BLOG SİLME HATASI ADMİN", error);

    }
};

module.exports.updateUserRole = async (req, res) => {
    const userID = req.params.id;
    try {
        const user = await User.findById(userID);

        if (user.role === "admin") {
            user.role = "user";  // Rolü "user" olarak güncelliyoruz
        } else {
            user.role = "admin";  // Rolü "yönetici" olarak güncelliyoruz
        }

        await user.save();  // Değişiklikleri veritabanına kaydediyoruz

        res.status(200).json({ message: `Kullanıcı ${user.role === 'yönetici' ? 'yönetici' : 'user'} olarak güncellendi.` });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error });
    }
};

module.exports.deleteComment = async (req, res) => {
    const commentID = req.params.id;

    try {
        await Blog.updateMany(
            { "commnet": commentID },
            { $pull: { comment: commentID } }
        );

        const deletedComment = await Comment.findByIdAndDelete(commentID);
        res.status(200).json({ message: 'Yorum  başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu.', error });
    }
}

module.exports.fetchComplaint = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate({
                path: "reportedBlogs",
                select: "-content" // 'content' alanını hariç tutar
            })
            .populate("reportedComments")
            .populate("reportedUsers")
            .populate("user");

        res.status(200).json(complaints);
    } catch (error) {
        console.error("Şikayetleri alırken bir hata oluştu:", error);
        res.status(500).json({ message: "Şikayetleri alırken bir hata oluştu." });
    }
};

module.exports.complaintResolved = async (req, res) => {
    const complaintID = req.params.resolved
    try {
        const complaint = await Complaint.findById(complaintID);
        complaint.status = "Çözüldü,Şikayet Edilen kaldırılmalı";
        await complaint.save();
        res.status(200).json({ msg: "Şikayet Çözüldü" })
    } catch (error) {
        console.error("Şikayetin durumu değiştirilirken hata oluştu:", error);
        res.status(500).json({ msg: "Şikayetin durumu değiştirilirken hata oluştu." });
    }
}
module.exports.complaintRejected = async (req, res) => {
    const complaintID = req.params.rejected
    try {
        const complaint = await Complaint.findById(complaintID);
        complaint.status = "Şikayet Geçersiz";
        await complaint.save();
        res.status(200).json({ msg: "Şikayet Reddedildi" });
    } catch (error) {
        console.error("Şikayetin durumu değiştirilirken hata oluştu:", error);
        res.status(500).json({ msg: "Şikayetin durumu değiştirilirken hata oluştu." });
    }
}

module.exports.complaintExamine = async (req, res) => {
    const complaintID = req.params.examine
    try {
        const complaint = await Complaint.findById(complaintID);
        complaint.status = "İnceleniyor";
        await complaint.save();
        res.status(200).json({ msg: "Şikayet İnceleniyor" });
    } catch (error) {
        console.error("Şikayetin durumu değiştirilirken hata oluştu:", error);
        res.status(500).json({ msg: "Şikayetin durumu değiştirilirken hata oluştu." });
    }
}

module.exports.deleleteComplaint=async (req,res) => {
    const id=req.params.id;
    try {
        const complaint= await Complaint.findByIdAndDelete(id);
        res.status(200).json({msg:"Şikayet Kaldırıldı"})
    } catch (error) {
        console.error("Şikayet Silinirken hata oluştu:", error);
        res.status(500).json({ msg: "Şikayetin silinirken hata oluştu." });
    }
}


