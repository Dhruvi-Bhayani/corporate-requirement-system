import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { sequelize } from "./db.js";

async function seedAdmin() {
  try {
    await sequelize.authenticate();

    const email = "admin@portal.com";
    const password = "Admin@123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log("Admin already exists");
      return;
    }

    await User.create({
      email,
      full_name: "System Admin",
      password_hash: hashedPassword,
      role: "admin",
      is_verified: true,
    });

    console.log("Admin created successfully!");
  } catch (err) {
    console.error("Admin seed error:", err);
  }
}

seedAdmin();
