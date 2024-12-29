const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Şikayeti yapan kullanıcı
  },
  title: {
    type: String,
    enum: [
      'Spam',
      'Yanıltıcı İçerik',
      'Taciz',
      'Uygunsuz Davranış',
      'Diğer'
    ], // Belirlenen şikayet türleri
    required: true,
  },
  description: {
    type: String,
    required: true, // Şikayetin detayı
  },
  status: {
    type: String,
    enum: ['Beklemede', 'İnceleniyor', 'Çözüldü,Şikayet Edilen kaldırılmalı',"Şikayet Geçersiz"],
    default: 'Beklemede', // Şikayet durumu
  },
  reportedUsers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Şikayet edilen kullanıcılar (isteğe bağlı)
  },
  reportedBlogs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: false, // Şikayet edilen bloglar (isteğe bağlı)
  },
  reportedComments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
