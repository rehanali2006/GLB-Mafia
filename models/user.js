const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (user) {
    const Listing = require("./listing");
    await Listing.deleteMany({ _id: { $in: user.listings } });
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
