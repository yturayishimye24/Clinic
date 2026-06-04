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

  // Create nurse user
  const existingNurse = await User.findOne({ email: "yturayishimye@gmail.com" });
  if (!existingNurse) {
    const hashedPassword = await bcrypt.hash("turayishimye", 10);
    const nurseUser = new User({
      username: "Yves",
      email: "yturayishimye@gmail.com",
      role: "nurse",
      password: hashedPassword,
    });
    await nurseUser.save();
    console.log("Nurse created (seed)");
  } else {
    console.log("Nurse already exists (seed)");
  }
};

