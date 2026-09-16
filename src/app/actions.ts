// app/actions.ts
"use server";

import { db } from "@/lib/auth";

// Import the db you just exported! 
// (Adjust the path if your auth.ts is inside a /lib or /server folder, e.g., "@/lib/auth")

export async function preCheckEmail(email: string) {
  try {
    // Because you are using the native MongoClient, we use .collection() and .findOne()
    const existingUser = await db.collection("user").findOne({ email });
    
    // Returns true if the user is found in the database
    return !!existingUser; 
  } catch (error) {
    console.error("Database check failed:", error);
    return false;
  }
}