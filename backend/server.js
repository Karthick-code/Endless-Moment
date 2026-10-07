import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { connectDB, readLocalFile, writeLocalFile, isStrictMongo } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import UserModel from "./models/User.js";
import bookingRoutes from './routes/bookingRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import { seedServices } from './seedData.js';

dotenv.config();

const PORT = Number(process.env.PORT || 5000);
const FRONTEND_URL = (  process.env.FRONTEND_URL ||  "http://localhost:5173").trim().replace(/\/+$/, "");

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/availability", availabilityRoutes);

async function seedDefaultAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@test.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  if (isStrictMongo()) {
    const masterCount = await UserModel.countDocuments({ role: "master_admin" });
    if (masterCount === 0) {
      const existing = await UserModel.findOne({ email });
      if (existing) {
        existing.role = "master_admin";
        existing.active = true;
        await existing.save();
        console.log(`🟩 Existing administrator promoted to Master Admin: ${email}`);
      } else {
        await UserModel.create({ email, passwordHash, role: "master_admin", active: true });
        console.log(`🟩 Master administrator created: ${email}`);
      }
    }
    return;
  }

  const users = readLocalFile("users.json");
  if (!users.some(u => u.role === "master_admin")) {
    const existing = users.find(u => u.email === email);
    if (existing) {
      existing.role = "master_admin";
      existing.active = true;
    } else {
      users.push({ _id: "u_default_seed", email, passwordHash, role: "master_admin", active: true });
    }
    writeLocalFile("users.json", users);
    console.log(`🟩 Master administrator ready: ${email}`);
  }
}

async function startServer() {
  try {
    await connectDB();
    await seedDefaultAdmin();
    await seedServices();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 ENDLESS Moments backend listening on port ${PORT}`);
      console.log(`🌐 Allowed frontend origin: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("❌ Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
