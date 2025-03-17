import { startMESIListener } from "./listeners/mesiListener";
// import { startCareConnectListener } from "./listeners/careconnectListener";
import { startBaxterListener } from "./listeners/baxterListener";

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

  // **Start EMR Listeners**
  // if (emr === "CareConnect") {
  //   startCareConnectListener(user);
  // } else if (emr === "Sanday") {
  //   console.log("🔜 FHIR Listener for Sanday coming soon...");
  // }

  // **Start Device Listeners**
  if (devices.some(device => device.manufacturer === "MESI")) {
    startMESIListener(emr); // ✅ Pass EMR name
  }
  if (devices.some(device => device.manufacturer === "Baxter")) {
    startBaxterListener(emr);
  }

  console.log("✅ [startWatchers] Listeners have been successfully initiaited.");
};

