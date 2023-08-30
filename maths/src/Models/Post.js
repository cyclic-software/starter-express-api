const { Schema, model, pluralize } = require("mongoose");
const { ObjectId } = Schema.Types;

pluralize(null); // this will not add s in collection name
const PostSchema = new Schema({
  content: { type: String },
  mediaFile: { type: String },
  user: { type: ObjectId, ref: "user", required: true },
  likes: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
  replies: [
    {
      user: {
        type: ObjectId,
        ref: "user",
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
});

PostSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.postId = ret._id;
    ret.postContent = ret.content;
    delete ret._id;
    delete ret.content;
    delete ret.__v;
    return ret;
  },
};

module.exports = model("post", PostSchema);
