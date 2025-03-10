import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,  
    },
  });
  
app.post("/send-email", async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: "New Course Enquiry",
    html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">📩 New Course Enquiry from ${firstName} ${lastName}</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; background: #f1f1f1; font-weight: bold;">First Name</td>
            <td style="padding: 10px; background: #fff;">${firstName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f1f1f1; font-weight: bold;">Last Name</td>
            <td style="padding: 10px; background: #fff;">${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f1f1f1; font-weight: bold;">Email</td>
            <td style="padding: 10px; background: #fff;"><a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f1f1f1; font-weight: bold;">Mobile Number</td>
            <td style="padding: 10px; background: #fff;">${phone}</td>
          </tr>
        </table>
  
        <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
          📌 Submitted on: <strong>${new Date().toLocaleString()}</strong>
        </p>
  
        <p style="text-align: center; margin-top: 10px;">
          <a href="mailto:${email}" style="background: #007bff; color: #fff; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">Reply to Sender</a>
        </p>
      </div>
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
