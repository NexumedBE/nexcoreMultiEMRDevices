import { startMESIListener } from "./listeners/mesiListener";
import { startCareConnectListener } from "./listeners/careconnectListener";
import { startBaxterListener } from "./listeners/baxterListener";


export const startWatchers = (user: any) => {
  console.log("🔥 [startWatchers] Checking user's setup...");

  const emr = user?.emrProviders?.[0]?.name || "Unknown EMR";
  const devices = user?.selectedDevices || [];

  console.log(`🚀 [startWatchers] User's EMR: ${emr}`);
  console.log(`🔍 [startWatchers] Devices:`, devices.map(d => d.device));

  // **Start EMR Listeners**
  if (emr === "CareConnect") {
    startCareConnectListener();
  } else if (emr === "Sandy") {
    console.log("🔜 FHIR Listener for Sandy coming soon...");
  }

  // **Start Device Listeners**
  devices.forEach((device) => {
    if (device.manufacturer === "MESI") {
      startMESIListener();
    }
  });

  console.log("✅ [startWatchers] Listeners have been successfully started.");
};
