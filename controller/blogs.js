
const multer = require("multer");
// const upload = multer({ dest: 'uploads/' }); // Yükleme yapılacak klasörü belirliyoruz
const User = require("../models/user")
const Blog = require("../models/blogs")
const Category = require("../models/category")
const Comment = require("../models/comment")


const path = require('path');
const mongoose = require("mongoose")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Resimlerin kaydedileceği klasör
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Dosya adı
    }
});
const upload = multer({ storage: storage });
// module.exports.getBlogs=async (req,res) => {
//     try {
//         const blogs= await Blogs.find();
//         res.status(200).json(blogs)
//     } catch (error) {
//         res.status(400).send("Veri bulunamadı veya Hata OLUŞTU !!!!!")
//     }

// }

// User modelini içeri aktar

module.exports.createBlog = async (req, res) => {
    const { title, content, categories } = req.body;
    const user = req.user;
    const image = req.file;

    console.log("Kategoriler:", categories);

    try {
        // Eğer categories bir string ise, JSON.parse ile diziye dönüştür
        let parsedCategories = categories;
        if (typeof categories === 'string') {
            try {
                parsedCategories = JSON.parse(categories);
            } catch (error) {
                console.log("JSON parse hatası:", error);
                return res.status(400).json({ message: "Geçersiz kategori formatı" });
            }
        }

        // Kategorilerin doğru bir dizi olduğunu kontrol et
        if (!Array.isArray(parsedCategories)) {
            return res.status(400).json({ message: "Kategoriler dizisi geçerli değil" });
        }

        // Kategorileri ObjectId'ye dönüştür
        const categoryIds = parsedCategories.map(id => new mongoose.Types.ObjectId(id.toString()));

        // Yeni blog oluştur
        const newBlog = new Blog({
            title,
            content,
            categories: categoryIds,
            user: user.id,
            image: image.path,
        });

        // Blogu kaydet
        await newBlog.save();
        console.log("Resim yolu:", req.file.path);  // Yüklenen resmin dosya yolu

        // Kullanıcıyı güncelle ve blogu kullanıcıya ekle
        await User.findByIdAndUpdate(user.id, {
            $push: { blogs: newBlog._id }  // Kullanıcı modelindeki 'blogs' dizisine yeni blogu ekle
        });

        // Blogu kullanıcı ve kategori bilgileriyle birlikte al
        const populatedBlog = await Blog.findById(newBlog._id)
            .populate('user', 'username email')  // Kullanıcı bilgilerini al
            .populate('categories', 'name')
            .populate("comment", "content") // Kategori bilgilerini al
            .exec();

        // Başarı mesajı ile birlikte blog verisini döndür
        res.status(201).json({ message: 'Blog başarıyla oluşturuldu', populatedBlog });

    } catch (error) {
        console.log("Hata:", error);
        res.status(500).json({ message: "Blog oluşturulurken bir hata oluştu" });
    }
};


module.exports.createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        // Kategori ismi boş olamaz
        if (!name) {
            return res.status(400).json({ message: 'Kategori ismi gereklidir.' });
        }

        // Kategori zaten var mı diye kontrol et
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Bu kategori zaten mevcut.' });
        }

        // Yeni kategori oluştur
        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save();

        // Kategori başarıyla oluşturuldu
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Kategori oluşturulurken bir hata oluştu.' });
    }
}
module.exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find(); // Tüm kategorileri al

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }

        res.status(200).json(categories); // Kategorileri döndür
    } catch (err) {
        // Hata detaylarını loglayalım
        console.error("Kategori getirme hatası:", err);

        // Hata mesajını döndürelim
        res.status(500).json({
            message: 'Error fetching categories',
            error: err.message || 'Unknown error',  // Detaylı hata mesajı
            stack: err.stack // Stack trace ile daha fazla bilgi
        });
    }
};
module.exports.getBlog = async (req, res) => {
    try {
        const { sort, categories, limit } = req.query;
        
        let query = {};
        let sortCriteria = {};

        // Default olarak tüm blogları çekmek
        if (!sort && !categories && !limit) {
            const blogs = await Blog.find().populate("user").populate("categories");
            return res.status(200).json(blogs);
        }

        if (sort === "latest") {
            sortCriteria = { createdAt: -1 };
        } else if (sort === "popular") {
            sortCriteria = { likes: -1 };
        } else if (categories === "random") {
            const categoriesList = await Blog.aggregate([
                { $unwind: "$categories" }, // Her kategori için ayrı bir belge oluştur
                {
                    $group: {
                        _id: "$categories", // Kategorilere göre grupla
                        blog: { $first: "$$ROOT" } // Her gruptan ilk belgeyi al
                    }
                },
                { $sample: { size: parseInt(limit) || 10 } }, // Rastgele gruplardan belirli sayıda seç
                {
                    $replaceRoot: {
                        newRoot: "$blog" // Sonuç olarak sadece blog verisini döndür
                    }
                }
            ]);
            ;
            return res.status(200).json(categoriesList);

        }


        const blogs = await Blog.find(query).sort(sortCriteria).limit(parseInt(limit) || 10)
            .populate("user")
            .populate("categories");
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.allBlog = async (req, res) => {
    try {

        const blogs = await Blog.find()
            .populate("user")
            .populate("categories");

        res.status(200).json(blogs)

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




module.exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('user categories comment likes') // Blog'un user ve categories bilgilerini populate ediyor
            .populate({
                path: 'comment', // comment içerisindeki user bilgisini de populate et
                populate: {
                    path: 'user', // Yorumların user bilgisi
                    select: 'username email profilePicture' // Hangi alanları almak isterseniz, örneğin sadece username ve email
                }
            })

        console.log("blog");

        if (!blog) {
            return res.status(404).json({ message: 'Blog bulunamadı' });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports.deleteBlogById = async (req, res) => {
    const { id } = req.params;

    try {
        // Blogu bulun ve sil   await Blog.deleteMany({ user:id });
        //KULLANICININ TÜM YORUMLARI SİLİNİYOR
        await Comment.deleteMany({ blog: id });

        const deletedBlog = await Blog.findByIdAndDelete(id).populate("");

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog bulunamadı" });
        }

        // Kullanıcıdan blogu sil
        await User.findByIdAndUpdate(
            deletedBlog.user, // Blogun bağlı olduğu kullanıcıyı al
            { $pull: { blogs: id } }, // blogs dizisinden blog ID'sini kaldır
            { new: true }
        );

        res.status(200).json({ message: "Blog Silindi ve Kullanıcıdan Kaldırıldı" });
    } catch (error) {
        console.error('Blog silinirken bir hata oluştu:', error);
        res.status(500).json({ message: 'Bir hata oluştu', error });
    }
};
module.exports.isArchiveSet = async (req, res) => {

    const { id } = req.params; // URL parametresinden ID'yi alıyoruz
    try {
        const blog = await Blog.findById(id);  // Blogu buluyoruz
        if (!blog) {
            return res.status(404).json({ message: "Blog bulunamadı" });
        }

        // isArchive değerini true yapıyoruz
        blog.isArchive = true;
        await blog.save();

        res.status(200).json({ message: "Blog arşivlendi" });
    } catch (error) {
        console.error('Arşivleme hatası:', error);
        res.status(500).json({ message: "Bir hata oluştu", error });
    }
}

// module.exports.likeAdd = async (req, res) => {
//     const { id } = req.params; // Blog ID'sini alıyoruz
//     const userId = req.user.id; // User ID'sini JWT'den alıyoruz

//     try {

//         const blog = await Blog.findByIdAndUpdate(
//             id,
//             { $pull: { likes: new mongoose.Types.ObjectId(userId) } }, // likes array'inden ObjectId ile eşleşen userId'yi çıkar
//             { new: true }
//         );



//         if (!blog) {
//             return res.status(404).json({ message: "Blog bulunamadı" });
//         }

//         // Eğer kullanıcı daha önce beğenmediyse, beğeni ekliyoruz
//         if (!blog.likes.includes(userId)) {
//             blog.likes.push(userId);
//             await blog.save(); // Beğeni eklendikten sonra kaydediyoruz
//         }

//         // Beğeni sayısını döndürüyoruz
//         return res.status(200).json({ message: "Beğeni güncellendi", likes: blog.likes.length });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Bir hata oluştu", error });
//     }
// };




module.exports.likeAdd = async (req, res) => {
    const { id } = req.params; // Blog ID'sini alıyoruz
    const userId = req.user.id; // User ID'sini JWT'den alıyoruz
    console.log("BEĞENENECEK KULLANICI", req.user);


    try {
        // Blog'u ID'sine göre buluyoruz
        let blog = await Blog.findById(id);
        let user = await User.findById(userId);



        if (!blog) {
            return res.status(404).json({ message: "Blog bulunamadı" });
        }

        // Kullanıcının zaten beğeni yapıp yapmadığını kontrol et
        const alreadyLiked = blog.likes.some((like) => like.toString() === userId);

        if (alreadyLiked) {
            // Kullanıcı ID'sini "likes" listesinden kaldır
            blog.likes = blog.likes.filter((like) => like.toString() !== userId);
            user.likes = user.likes.filter((like) => like.toString() !== id);
            console.log(`Kullanıcı beğeniyi kaldırdı: ${userId}`);
        } else {
            // Kullanıcı ID'sini "likes" listesine ekle
            blog.likes.push(new mongoose.Types.ObjectId(userId));
            user.likes.push(new mongoose.Types.ObjectId(id));
            console.log(`Kullanıcı blog'u beğendi: ${userId}`);
        }

        // Blog'u kaydet ve güncel belgeyi al
        blog = await blog.save();
        user = await user.save();
        console.log("Bloğu beğenen kullanıcı", user);


        // Beğeni durumunu ve toplam beğeni sayısını döndür
        return res.status(200).json({
            message: alreadyLiked ? "Beğeni kaldırıldı." : "Beğeni eklendi.",
            likes: blog.likes.length,
            alreadyLiked: !alreadyLiked,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Bir hata oluştu", error });
    }
};

module.exports.addComment = async (req, res) => {
    const { id } = req.params; // Blog ID'sini alıyoruz
    const { commentContent } = req.body; // Yorum içeriğini alıyoruz
    const userId = req.user.id; // Kullanıcı ID'sini alıyoruz (auth middleware'den)

    if (!commentContent || !commentContent.trim()) {
        return res.status(400).json({ message: "Yorum içeriği boş olamaz." });
    }

    try {
        // Blog'u ID ile buluyoruz
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog bulunamadı" });
        }

        // Yeni yorumu oluşturuyoruz
        const newComment = new Comment({
            content: commentContent, // Yorum içeriği
            user: userId, // Kullanıcı ID'si
            blog: id, // Blog ID'si
        });

        // Yorum veritabanına kaydediyoruz
        await newComment.save();

        // Blog'a yeni yorumu ekliyoruz
        blog.comment.push(newComment._id);
        await blog.save();

        return res.status(200).json({ message: "Yorum başarıyla eklendi", comment: newComment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Bir hata oluştu", error: err });
    }
};

//TAKİP EDİLENLERİN BLOGLARININ ANASAYFADA GÖSTERİLMESİ

module.exports.followingBlogs = async (req, res) => {
    const userID = req.user.id
    console.log("USER", userID);

    try {
        const user = await User.findById(userID).populate("following");
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }
        // res.status(200).json({msg:"Kullanıcı",user})

        const blogs = await Blog.find({ user: { $in: user.following } })
            .sort({ createdAt: -1 }) // Yeni gönderiler önce gelsin
            .limit(10) // Son 10 gönderiyi getirin
            .populate("user") // Blog sahibini populate edin
            .populate("categories"); // Kategorileri populate edin

        res.status(200).json(blogs);

    } catch (error) {
        res.status(500).json({ msg: "BİR HATA OLUŞTU", error: error.message });
    }
}
