import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pgvpsoy.mongodb.net/?appName=Cluster0`);
const db = client.db("EduJira");

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
  }, 
  
});