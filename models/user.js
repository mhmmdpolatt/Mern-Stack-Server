const mongoose = require('mongoose');

// User şeması
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Kullanıcı ile ilişkili blog yazılarını tutacak
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  }],
  // Kullanıcının takipçileri
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Takipçiler de kullanıcılar olduğundan 'User' modeline referans
  }],
  // Kullanıcının takip ettiği diğer kullanıcılar
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // Kullanıcının profil resmi URL'si
  profilePicture: {
    type: String,
    default: '', // Profil resmi yoksa varsayılan olarak boş bırakabilirsiniz
  },
  // Kullanıcının biyografisi
  bio: {
    type: String,
    default: '', // Biyografi boş olabilir
  },
  // Kullanıcının ilgilendiği kategoriler
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Category modeline referans
  }],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
    }
  ],
  role: { type: String, enum: ['user', 'admin','yönetici'], default: 'user' }
}, { timestamps: true });

// User modelini oluştur
const User = mongoose.model('User', userSchema);

module.exports = User;
