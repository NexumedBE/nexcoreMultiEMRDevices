import { Router, Request, Response } from "express";
import User from "../../models/User";

const router = Router();

router.post("/users/email/:email/acceptLic", async (req: Request<{ email: string }>, res: Response): Promise<void> => {
    console.log("🔍 Received request to accept license for email:", req.params.email);
    console.log("✅ Route hit: /users/email/:email/acceptLic");
    console.log("📩 Email received:", req.params.email);

    try {
        const { email } = req.params;
        console.log("🔍 Searching for user:", email);

        const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
        console.log("🛠️ Found user:", user);

        if (!user) {
            console.log("❌ User not found for email:", email);
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.accept === undefined) {
            user.accept = false;
        }

        user.accept = true;
        await user.save();

        console.log("✅ License agreement accepted successfully for:", email);
        res.status(200).json({ message: "License agreement accepted successfully." });

    } catch (error) {
        console.error("❌ Error updating license agreement:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Test route for debugging
router.post("/test", (req, res) => {
    res.send("Hello world!");
});

export default router;
