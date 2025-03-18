import express from "express";
import { loginUser, validateToken, refreshToken } from "./authController";

const router = express.Router();

// ✅ Register the login route
router.post("/login", loginUser);

// ✅ Register the token validation route
router.post("/validate", validateToken);

// ✅ Register the refresh token validation route
router.post("/refresh", refreshToken); 


export default router;


