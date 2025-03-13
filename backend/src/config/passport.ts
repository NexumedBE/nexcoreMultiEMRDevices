import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User";

// Configure LocalStrategy (disable session)
passport.use(
  new LocalStrategy(
    { usernameField: "email", session: false }, // Prevent session conflicts
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          console.warn("⚠️ Login failed: Incorrect email");
          return done(null, false, { message: "Incorrect email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.warn("⚠️ Login failed: Incorrect password");
          return done(null, false, { message: "Incorrect password." });
        }

        console.log("✅ User authenticated successfully:", user.email);
        return done(null, user);
      } catch (err) {
        console.error("❌ Error in Passport strategy:", err);
        return done(err);
      }
    }
  )
);

// Serialize user to session (not used when session: false)
passport.serializeUser((user: any, done) => {
  try {
    console.log("🔹 Serializing user:", user.id);
    done(null, user.id);
  } catch (err) {
    console.error("❌ Error during serialization:", err);
    done(err, null);
  }
});

// Deserialize user from session (not used when session: false)
passport.deserializeUser(async (id, done) => {
  try {
    console.log("🔹 Deserializing user with ID:", id);
    const user = await User.findById(id);
    if (!user) {
      console.warn("⚠️ User not found during deserialization.");
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    console.error("❌ Error during deserialization:", err);
    done(err, null);
  }
});

export default passport;

