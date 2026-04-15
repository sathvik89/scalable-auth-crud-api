/**
 * Seeds demo admin, demo user, and sample tasks (invigilator / demo use).
 * Run from backend folder: npm run seed
 * Requires MONGO_URI in .env (same as the API).
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Task = require("../models/Task");

const DEMO = {
  admin: {
    email: "demo.admin@example.com",
    password: "DemoAdmin123",
    name: "Demo Admin",
    role: "admin",
  },
  user: {
    email: "demo.user@example.com",
    password: "DemoUser123",
    name: "Demo User",
    role: "user",
  },
};

const TASKS_ADMIN = [
  { title: "Moderate submissions", description: "Review pending items from the queue." },
  { title: "Export quarterly report", description: "Pull metrics for the review meeting." },
  { title: "Update access policy", description: "Align demo environment permissions." },
];

const TASKS_USER = [
  { title: "Complete onboarding checklist", description: "Finish profile and first task." },
  { title: "Prepare demo walkthrough", description: "Steps for invigilator review." },
  { title: "Follow up on feedback", description: "Address notes from last session." },
  { title: "Archive old notes", description: "Clean up completed items." },
];

async function upsertUser({ email, password, name, role }) {
  const hashed = await bcrypt.hash(password, 10);
  let doc = await User.findOne({ email });
  if (doc) {
    doc.name = name;
    doc.password = hashed;
    doc.role = role;
    await doc.save();
    return doc;
  }
  return User.create({ email, name, password: hashed, role });
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const admin = await upsertUser(DEMO.admin);
  const user = await upsertUser(DEMO.user);

  await Task.deleteMany({ user: { $in: [admin._id, user._id] } });

  await Task.insertMany(
    TASKS_ADMIN.map((t) => ({ ...t, user: admin._id })),
  );
  await Task.insertMany(
    TASKS_USER.map((t) => ({ ...t, user: user._id })),
  );

  console.log("Seed complete.");
  console.log("  Admin:", DEMO.admin.email, "/", DEMO.admin.password);
  console.log("  User: ", DEMO.user.email, "/", DEMO.user.password);
  console.log(`  Tasks: ${TASKS_ADMIN.length} for admin, ${TASKS_USER.length} for user.`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
