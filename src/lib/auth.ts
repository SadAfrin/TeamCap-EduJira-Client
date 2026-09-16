import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { emailOTP } from "better-auth/plugins"; // 1. Import the OTP plugin
import nodemailer from "nodemailer";
import dns from "node:dns";

// Fix for Node.js SRV DNS resolution on Windows / MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if DNS server configuration is restricted
}

const mongoURI =
  process.env.MONGODB_URI ||
  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-ljjoee5-shard-00-00.7wzdopz.mongodb.net:27017,ac-ljjoee5-shard-00-01.7wzdopz.mongodb.net:27017,ac-ljjoee5-shard-00-02.7wzdopz.mongodb.net:27017/?ssl=true&replicaSet=atlas-une3pz-shard-0&authSource=admin&appName=Cluster0`;

const client = new MongoClient(mongoURI);



const db = client.db("EduJira");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const auth = betterAuth({
  database: mongodbAdapter(db),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true, 
        defaultValue: "student", 
      },
    },
  },
  emailAndPassword: { 
    enabled: true, 
    requireEmailVerification: true,
  }, 
  
  // 2. This keeps your CLICKABLE LINKS for new sign-ups working perfectly!
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await transporter.sendMail({
        from: `"EduJira Admin" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Verify your EduJira account",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Welcome to EduJira, ${user.name}!</h2>
            <p>Please click the button below to verify your email address and activate your account.</p>
            <a href="${url}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
              Verify Email
            </a>
          </div>
        `,
      });
    },
  },

  // 3. This activates the 6-DIGIT OTP system strictly for password resets!
  plugins: [
    emailOTP({ 
      async sendVerificationOTP({ email, otp, type }) { 
        if (type === "forget-password") { 
          await transporter.sendMail({
            from: `"EduJira Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Password Reset Code",
            html: `
              <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                <h2>Password Reset</h2>
                <p>Your 6-digit reset code is:</p>
                <h1 style="letter-spacing: 6px; color: #4f46e5; font-size: 32px; background: #f8fafc; padding: 15px; border-radius: 8px; display: inline-block;">${otp}</h1>
                <p style="font-size: 12px; color: #666; margin-top: 20px;">This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
              </div>
            `,
          });
        } 
      }, 
    }) 
  ]
});