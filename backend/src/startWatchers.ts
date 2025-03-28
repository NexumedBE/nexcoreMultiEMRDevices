import { startMESIListener } from "./listeners/mesiListener";
import { startBaxterListener } from "./listeners/baxterListener";
import { activeListeners } from "./utils/watcherManager"; 

export const startWatchers = (user: {
  id: string;
  current: boolean;
  emrProviders: any;
  selectedDevices: any;
}) => {
  console.log("🔥 [startWatchers] Checking user's setup...");

  const emr = user?.emrProviders?.[0]?.name || "Unknown EMR";
  const devices: { manufacturer: string }[] = user?.selectedDevices || [];

  console.log(`🚀 [startWatchers] User's EMR: ${emr}`);
  console.log(`🔍 [startWatchers] Devices:`, devices.map(d => d.manufacturer));

  // ✅ Avoid double starting MESI
  if (devices.some(device => device.manufacturer === "MESI") && !activeListeners.has("MESI")) {
    activeListeners.add("MESI");
    startMESIListener(emr);
  }

  // ✅ Avoid double starting BAXTER
  if (devices.some(device => device.manufacturer === "BAXTER") && !activeListeners.has("BAXTER")) {
    activeListeners.add("BAXTER");
    startBaxterListener(emr);
  }

  console.log("✅ [startWatchers] Listeners have been successfully initiaited.");
};

