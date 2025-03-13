import { useState, useEffect, useRef } from "react";
import packageJson from "../../package.json"; // Importing the JSON file

import "../App.css";

const UpdateNotification: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState("");
  const installedVersionRef = useRef(packageJson.version); 

  useEffect(() => {
    // Listen for update notifications from the main process
    window.api.onUpdateAvailable((version) => {
      setLatestVersion(version);

      // Compare installed version (stored in ref) with the latest version
      if (version !== installedVersionRef.current) {
        setUpdateAvailable(true); // New update is available
      } else {
        setUpdateAvailable(false); // No update available
      }
    });
  }, [latestVersion]); // Only re-run when latestVersion changes

  if (!updateAvailable) return null; // Don't render if no update is available

  return (
    <div className="update-modal-overlay">
      <div className="update-modal">
        <h2>🚀 Update Available!</h2>
        <p>New version: {latestVersion} (Installed: {installedVersionRef.current})</p>
        <div className="update-modal-buttons">
          <button
            className="download-button"
            onClick={() => window.open("https://nexumed.eu/download")}
          >
            Download Update
          </button>
          <button className="close-button" onClick={() => setUpdateAvailable(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;



