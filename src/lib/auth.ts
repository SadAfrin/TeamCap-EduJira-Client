import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import nodemailer from "nodemailer";

const client = new MongoClient(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pgvpsoy.mongodb.net/?appName=Cluster0`);
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
  
});