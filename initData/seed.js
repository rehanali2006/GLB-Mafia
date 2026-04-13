require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Listing  = require("../models/listing");
const User     = require("../models/user");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/GLBmafia";

const sampleData = [
  {
    title: "Unit 1", type: "Notes", year: "First", branch: "CSE",
    section: "A", subject: "Mathematics I",
    image: "https://img.freepik.com/free-psd/sign-contract-document-with-pen-icon-3d-illustration_56104-2767.jpg",
    views: 120,
  },
  {
    title: "Unit 2", type: "Assignment", year: "Second", branch: "CSE",
    subject: "Data Structures",
    image: "https://img.freepik.com/free-psd/sign-contract-document-with-pen-icon-3d-illustration_56104-2767.jpg",
    views: 80,
  },
  {
    title: "Unit 1", type: "Paper", year: "Third", branch: "ECE",
    subject: "Computer Networks",
    image: "https://img.freepik.com/free-psd/sign-contract-document-with-pen-icon-3d-illustration_56104-2767.jpg",
    views: 200,
  },
];

async function seed() {
  await mongoose.connect(MONGO_URL);
  console.log(" Connected to MongoDB");

  // Create a demo admin user
  await User.deleteMany({ email: "admin@glbmafia.com" });
  const admin = new User({
    username: "admin",
    email: "admin@glbmafia.com",
    password: "admin123",
    role: "admin",
  });
  await admin.save();
  console.log(" Admin user created: admin@glbmafia.com / admin123");


  await Listing.deleteMany({});
  const listings = sampleData.map(d => ({ ...d, owner: admin._id }));
  const inserted = await Listing.insertMany(listings);

  admin.listings = inserted.map(l => l._id);
  await admin.save();

  console.log(` Seeded ${inserted.length} listings`);
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
