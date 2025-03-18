import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import fs from "fs";
import path from "path";
import User, { IUser } from "../../models/User"; 
import { startWatchers } from "../../startWatchers";
import { stopWatchers } from "../../utils/watcherUtils";

const statusFile = path.join(__dirname, "../../userStatus.json");
const activeUserFile = path.join(__dirname, "../../activeUser.json"); 

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";


const updateUserStatus = async (userId: string, current: boolean, userState: { id: string; current: boolean; emrProviders: any; selectedDevices: any }) => {
  try {
    let existingStatus = { current: false };
    if (fs.existsSync(statusFile)) {
      existingStatus = JSON.parse(fs.readFileSync(statusFile, "utf8"));
    }

      if (!current && existingStatus.current === false) {
        return;
      }
    
      if (existingStatus.current !== current) {
        fs.writeFileSync(statusFile, JSON.stringify({ current }), "utf8");
      }

    if (current) {
      console.log("🟢 [updateUserStatus] User is active! Calling startWatchers()...");
      startWatchers(userState);
    } else {
      console.log("⛔ [updateUserStatus] User is inactive! Calling stopWatchers()...");
      stopWatchers();
    }
    fs.writeFileSync(activeUserFile, JSON.stringify({ userId }), "utf8");
  } catch (error) {
    console.error("❌ [updateUserStatus] Error updating user status:", error);
  }
};

const TOKEN_EXPIRATION = "7d"; 

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(req.body.email);
  if (!req.body.email || !req.body.password) {
    console.error("❌ Missing email or password");
    if (!res.headersSent) {
      res.status(400).json({ message: "Missing email or password" });
    }
    return;
  }

  passport.authenticate("local", async (err: any, user: any, info: any) => {
    if (err) {
      console.error("❌ Passport error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Authentication error." });
      }
      return;
    }

    if (!user) {
      console.warn("⚠️ Invalid login attempt:", info?.message);
      if (!res.headersSent) {
        res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      return;
    }

    req.logIn(user, { session: false }, async (err) => {
      if (err) {
        console.error("❌ req.logIn error:", err);
        if (!res.headersSent) {
          res.status(500).json({ message: "Login session error." });
        }
        return;
      }

      const completeUser = await User.findById(user._id).select("-password").lean();

      if (!completeUser) {
        console.warn("⚠️ User not found.");
        if (!res.headersSent) {
          res.status(404).json({ message: "User not found." });
        }
        return;
      }

      const userId = completeUser._id.toString(); // Explicitly cast _id to string

      const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });

      const userState = {
        id: userId,
        current: completeUser.current,
        emrProviders: completeUser.emrProviders || [],
        selectedDevices: completeUser.selectedDevices || [],
      };

      await updateUserStatus(userId, completeUser.current, userState);

      if (!res.headersSent) {
        res.status(200).json({
          message: "Login successful.",
          user: {
            id: userId, // ✅ Fixed issue here
            email: completeUser.email,
            current: completeUser.current,
            accept: completeUser.accept,
            emrProviders: completeUser.emrProviders, 
            selectedDevices: completeUser.selectedDevices, 
          },
          token,
        });
      }
    });
  })(req, res, next);
};

export const validateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("🔍 [validateToken] Received request to validate token");

    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      console.log("❌ [validateToken] No token provided in request headers");
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    console.log("🔑 [validateToken] Token received:", token);

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { id: string };
      console.log("✅ [validateToken] Token decoded successfully:", decoded);
    } catch (verifyError) {
      console.error("❌ [validateToken] Token verification failed:", verifyError);
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("❌ [validateToken] User not found for token:", decoded.id);
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    console.log("✅ [validateToken] Token is valid for user:", user.email);
    res.status(200).json({ message: "Token valid", user });
  } catch (error) {
    console.error("❌ [validateToken] Unexpected error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    // ✅ Generate a new token
    const newToken = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });

    res.status(200).json({ token: newToken });
    return;
  } catch (error) {
    console.error("❌ Token refresh error:", error);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

