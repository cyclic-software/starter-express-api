const { Schema, model, pluralize } = require("mongoose");
const { ObjectId } = Schema.Types;
const { convertHash, compareHashedValue } = require("../Common/passwordHelper");
pluralize(null); // this will not add s in collection name
const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      dropDups: true,
    },
    firtsName: {
      type: String,
      required: "First name is required.",
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      //select: false,
    },
    dob: Date,
    role: {
      type: String,
      default: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedDate: {
      type: Date,
    },
    profilePicture: { type: String },
    joindDate: { type: Date, default: Date.now },
    // sentFriendRequests: [{ type: ObjectId, ref: "user" }],
    // receivedFriendRequests: [{ type: ObjectId, ref: "user" }],
    // friends: [{ type: ObjectId, ref: "user" }],
    // sentFollowRequests: [{ type: ObjectId, ref: "user" }],
    // receivedFollowRequests: [{ type: ObjectId, ref: "user" }],
    followers: [{ type: ObjectId, ref: "user" }],
    following: [{ type: ObjectId, ref: "user" }],
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  let user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();
  user.password = await convertHash(user.password);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await compareHashedValue(candidatePassword, this.password);
  //cb(null, isMatch);
};

UserSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.userId = ret._id;
    delete ret._id;
    delete ret.password;
    delete ret.__v;
    return ret;
  },
};

module.exports = model("user", UserSchema);
