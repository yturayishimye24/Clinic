import User from "../backend/models/userModel.js";
import bcrypt from "bcrypt";

export const seed = async () => {
  const existingAdmin = await User.findOne({ email: "yummy@gmail.com" });

  // create the admin user only if it does not already exist
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin", 10);

    const createdUser = new User({
      username: "Cench",
      email: "yummy@gmail.com",
      role: "admin",
      password: hashedPassword,
    });

    await createdUser.save();
    console.log("Admin created (seed)");
  } else {
    console.log("Admin already exists (seed)");
  }
};

