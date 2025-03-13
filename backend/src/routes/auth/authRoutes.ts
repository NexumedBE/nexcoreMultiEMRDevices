import express from "express";
import { loginUser, validateToken, refreshToken } from "./authController";

const router = express.Router();

// ✅ Register the login route
router.post("/auth/login", loginUser);

// ✅ Register the token validation route
router.post("/auth/validate", validateToken);

// ✅ Register the refresh token validation route
router.post("/auth/refresh", refreshToken); 


export default router;


