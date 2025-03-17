import cron from "node-cron";
import fs from "fs";
import path from "path";
import User from "../models/User";
import { startWatchers } from "../startWatchers";
import { stopWatchers } from "../utils/watcherUtils";

const userFile = path.join(__dirname, "../activeUser.json");
const statusFile = path.join(__dirname, "../userStatus.json");

const checkUserSubscriptions = async () => {
  console.log("🔄 Running monthly subscription check for the active user...");

  try {
    if (!fs.existsSync(userFile)) {
      console.warn("⚠️ No active user found. Skipping sub check.");
      return;
    }

    const { userId } = JSON.parse(fs.readFileSync(userFile, "utf8"));
    if (!userId) {
      console.warn("⚠️ No valid user ID found. Skipping subs check.");
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn(`⛔ User ID ${userId} not found. Stopping watchers...`);
      stopWatchers();
      return;
    }

    let lastStatus = { current: false };
    if (fs.existsSync(statusFile)) {
      lastStatus = JSON.parse(fs.readFileSync(statusFile, "utf8"));
    }
    
    if (lastStatus.current === user.current) {
      console.log("✅ No change in user status. No action needed.");
      return;
    }
    fs.writeFileSync(statusFile, JSON.stringify({ current: user.current }), "utf8");

    if (user.current) {

      const user = await User.findById(userId).lean(); // ✅ Add `.lean()` to return a plain object

      // console.log(`🟢 User ${user.email} is active. Keeping watchers running.`);

      if (!user) {
        console.warn(`⛔ User ID ${userId} not found. Stopping watchers...`);
        stopWatchers();
        return;
      }

      const userState = {
        id: user._id.toString(), 
        current: user.current,
        emrProviders: user.emrProviders || [],
        selectedDevices: user.selectedDevices || [],
      };

      startWatchers(userState);
    } else {
      console.warn(`⛔ User ${user.email} is inactive. Stopping watchers...`);
      stopWatchers();
    }

  } catch (error) {
    console.error("❌ Error checking user subscriptions:", error);
  }
};

// uses the package node-cron that calls this fucntion the first of every month.  
// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *
// from node-cron docs should future adaptations be needed.
cron.schedule("0 0 1 * *", checkUserSubscriptions);

export default checkUserSubscriptions;
