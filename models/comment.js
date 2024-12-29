const mongoose = require("mongoose")

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
}, { timestamps: true }); // timestamps, createdAt ve updatedAt alanlarını otomatik ekler)

const Comment=mongoose.model("Comment",CommentSchema);
module.exports=Comment
