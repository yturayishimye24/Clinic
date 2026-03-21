import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

dotenv.config();

export const autheticate = async (req, res, next) => {
  try{
  const auth = req.headers.authorization;
  if (!auth)
    return res
      .status(401)
      .json({ message: "Not autheticated", success: false });
  const token = auth.split(" ")[1];

  const payload = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.id).select("-password");
  if (!user)
    return res
      .status(403)
      .json({ message: "Ivalid user token", success: false });
  req.user = user;
  next();
}catch(error){
  console.log("Auth error",error.message);
  return res.status(401).json({message:"Authetication error",success:false})
}
};

