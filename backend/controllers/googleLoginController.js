import admin from "../firebaseAdmin.js";
import GoogleUser from "../models/googleLoginModel.js";

import jwt from "jsonwebtoken";

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

export const googleLoginController = async (req, res) => {
  try {
    console.log("BODY: ",req.body);

    const { token } = req.body;
     if(!token){
        return json.status(400).json({message:"Token not found",success:false})
     }
    const decoded = await admin.auth().verifyIdToken(token);

    const email = decoded.email;
    const name = decoded.name;

    let user = await GoogleUser.findOne({ email });

    if (!user) {

      user = await GoogleUser.create({
        email,
        username: name,
        role: "nurse"
      });

    }

    const jwtToken = createToken(user._id, user.role);

    res.json({
      success: true,
      token: jwtToken,
      user
    });

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Google login failed"
    });
  }
};