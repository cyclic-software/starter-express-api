const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true // add index to user field
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      index: true // add index to post field
    },
    is_del: { type: Boolean, default: false },
  },
    {
     timestamps: true,
   },
  );
  likeSchema.post('save', async function(like) {
    const postId = like.post;
    const likeCount = await mongoose.model('postwishlist').countDocuments({ post: postId });
    await mongoose.model('post').findByIdAndUpdate(postId, { $set: { wishlistCount: likeCount } });
  });
module.exports = mongoose.model('postwishlist', likeSchema);
