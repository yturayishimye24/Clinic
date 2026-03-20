import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const mailOptions ={
    from:{
        name: 'Clinic Admin',
        address: process.env.EMAIL
    },
    to: 'yturayishimiye@icircles.rw',
    subject: 'Request account from Clinic management system',
    text: 'Successfully created account'
}

const sendMail = async (transporter,mailOptions)=>{
    try{
        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
    }catch(error){
        console.log(error);
    }
}
sendMail(transporter,mailOptions)