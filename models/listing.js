const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
    },

    section: {
      type: String,
    },

    file: {
      url: String,
      filename: String,
    },

    

    subject: {
      type: String,
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.owner) {
    const User = require("./user");
    await User.findByIdAndUpdate(doc.owner, {
      $pull: { listings: doc._id },
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);