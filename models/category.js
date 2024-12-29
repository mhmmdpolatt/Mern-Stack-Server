const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: true
    },
    // Bloglar ile ilişki kurmak için kategoriye bağlı blogları referans olarak ekliyoruz
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',  // Blog modeline referans
        }
    ]
})

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category