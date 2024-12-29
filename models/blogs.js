const mongoose = require('mongoose');

// Blog şeması
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // tag: {
  //   type: String,
  //   required: true
  // },
  //ŞİMDİLİK İMAGE KALSIN
  image: {
    type: String, // Resmin URL'sini saklıyoruz
    required: false,
  },
  // Hangi kullanıcının blog yazısı olduğunu belirtmek için
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  ],
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment', // Blogdaki yorumlara referans
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Beğeniyi yapan kullanıcıları referans alıyoruz
    },
  ],
  isArchive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Blog modelini oluştur
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
