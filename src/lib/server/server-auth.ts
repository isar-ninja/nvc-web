"use server";
import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/server/firebase-admin";

export const authenticateRequest = async (req: NextRequest) => {
  try {
    // Get token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        authenticated: false,
        error: "Invalid authentication format",
      };
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return {
        authenticated: false,
        error: "No token provided",
      };
    }

    // Verify the token
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);

      // Optional: Additional validation as needed
      // For example, you could check if the user is still valid in your DB

      return {
        authenticated: true,
        uid: decodedToken.uid,
        email: decodedToken.email,
        // You can include other verified claims as needed
      };
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError);
      return {
        authenticated: false,
        error: "Invalid token",
      };
    }
  } catch (error) {
    console.error("Authentication process error:", error);
    return {
      authenticated: false,
      error: "Authentication system error",
    };
  }
};
