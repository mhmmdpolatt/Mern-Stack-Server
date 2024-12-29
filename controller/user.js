const express = require("express")
const User = require("../models/user");
const Category = require("../models/category");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
module.exports.getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).send("HATA")
    }

}

module.exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        // Yeni kullanıcı oluştur
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu' });
    } catch (error) {
        console.error('Kullanıcı kaydı sırasında hata:', error); // Hatayı logla

        // Eğer unique validation hatasıysa
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Bu kullanıcı adı veya e-posta zaten mevcut' });
        }

        // Genel hata
        res.status(500).json({ message: 'Kullanıcı kaydı başarısız' });
    }
}
module.exports.login = async (req, res) => {

    const { email, password } = req.body;
    //KULLANICIYI VERİ TABANINDAN BULMA 
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: "Geçersiz Parola Veya Email" })
        }
        //ŞİFRE KONTROLÜ
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Geçersiz Parola Veya Email" })
        }

        //TOKEN

        const token = jwt.sign(
            { id: user._id, name: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.header("x-auth-token", token).json({ message: "Login successful", token, user });
        console.log("KULLANICI TOKEN",token);
        


    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Sunucu hatası", error });
    }


}

module.exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    // Gelen ID'nin geçerli bir ObjectId olup olmadığını kontrol et
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Geçerli bir kullanıcı ID sağlamalısınız.' });
    }

    try {
        const user = await User.findById(userId)
            .populate('blogs')
            .populate("followers")
            .populate("following")
            .populate("likes") // blogs alanını blog verileriyle dolduruyor
            .exec(); // populate işlemi bitince sonucu alıyoruz

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı Bulunamadı" });
        }

        res.status(200).json(user); // Kullanıcıyı ve bloglarını döndürüyoruz
    } catch (error) {
        console.error('Kullanıcı bilgisi alınırken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};




module.exports.updateUserProfile = async (req, res) => {
    let { bio, categoryIds } = req.body;
    const userId = req.params.id;
    const image = req.file;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Eğer categoryIds bir string olarak geldiyse, onu parse et
        if (typeof categoryIds === 'string') {
            try {
                categoryIds = JSON.parse(categoryIds); // Stringi diziye çevir
            } catch (err) {
                return res.status(400).json({ message: 'categoryIds dizisi geçersiz' });
            }
        }

        // categoryIds'in bir dizi olup olmadığını kontrol et
        if (!Array.isArray(categoryIds)) {
            return res.status(400).json({ message: 'categoryIds bir dizi olmalıdır' });
        }

        // Kategorilerin ObjectId'ye dönüştürülmesi
        const categoryObjectIds = categoryIds.map(id => new mongoose.Types.ObjectId(id)); // Doğru şekilde ObjectId oluşturuluyor

        const categoryObjects = await Category.find({ '_id': { $in: categoryObjectIds } });
        if (categoryObjects.length !== categoryIds.length) {
            return res.status(400).json({ message: 'Geçersiz kategori ID\'leri' });
        }

        // Kullanıcıyı güncelle
        user.bio = bio || user.bio;
        user.categories = categoryObjects || user.categories;
        if (image) {
            user.profilePicture = image.path; // Profil fotoğrafı ekleme
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser); // Güncellenmiş kullanıcıyı döndür

    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Profil güncellenirken bir hata oluştu', error: err });

    }
};

module.exports.follow = async (req, res) => {
    const takipEdenId = req.user.id; // JWT'den alınan kullanıcı ID'si
    const takipEdilenId = req.params.id; // Takip edilecek kullanıcı ID'si


    try {
        const takipEden = await User.findById(takipEdenId);
        const takipEdilen = await User.findById(takipEdilenId);

        // Kullanıcıların varlığı kontrol ediliyor
        if (!takipEden) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.TAKİPEDEN' });
        } else if (!takipEdilen) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.TAKİPEdilen' });
        }

        // Kullanıcı zaten takip ediyorsa, takipten çıkar
        if (takipEden.following.includes(takipEdilenId)) {
            takipEden.following = takipEden.following.filter(id => id.toString() !== takipEdilenId);
            takipEdilen.followers = takipEdilen.followers.filter(id => id.toString() !== takipEdenId);

            await takipEden.save();
            await takipEdilen.save();

            return res.status(200).json({ message: 'Kullanıcı takipten çıkarıldı.' });
        }

        // Takip etme işlemi
        takipEden.following.push(takipEdilenId);
        takipEdilen.followers.push(takipEdenId);

        await takipEden.save();
        await takipEdilen.save();

        res.status(200).json({ message: 'Kullanıcı başarıyla takip edildi.' });
    } catch (error) {
        console.error('Takip etme işlemi sırasında hata:', error);
        res.status(500).json({ message: 'Bir hata oluştu.', error });
    }
};
