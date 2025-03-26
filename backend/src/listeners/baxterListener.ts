import chokidar from "chokidar";
import net from "net";
import fs from "fs";
import path from "path";
import https from "https";
import express from "express";
import { parseHL7 } from "../parsers/hl7Parser"; 
import { saveAsJSON } from "../utils/saveAsJSON"; 

const HL7_PORT = 281;
const HTTPS_PORT = 4344;
const SAVE_DIR = "C:\\Nexumed\\baxter";

// Ensure the directory exists
if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR, { recursive: true });
}

export const startBaxterListener = (emr: string) => {
  // 🚨 HL7 Listener (raw TCP, leave it HTTP-like)
  const server = net.createServer((socket) => {
    console.log("📡 HL7 Connection established");
    let hl7Message = "";

    socket.on("data", (data) => {
      const receivedMessage = data.toString();
      if (receivedMessage.startsWith("GET") || receivedMessage.startsWith("POST")) {
        console.warn("❌ Received an HTTP request instead of HL7. Ignoring.");
        return;
      }
      hl7Message += receivedMessage;
    });

    socket.on("end", () => {
      console.log("📥 Received HL7 Message:", hl7Message);

      hl7Message = hl7Message.replace(/^\x0b/, "").replace(/\x1c\r$/, "");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filePath = path.join(SAVE_DIR, `hl7_message_${timestamp}.hl7`);

      fs.writeFileSync(filePath, hl7Message, "utf8");
      console.log(`✅ HL7 Message saved to: ${filePath}`);

      const ackMessage =
        "\x0B" +
        "MSH|^~\\&|Nexcore|ReceiverApp|WelchAllyn|ConnexSpot|" +
        timestamp +
        "||ACK^A01|12345|P|2.3\rMSA|AA|12345\r" +
        "\x1C\r";

      socket.write(ackMessage);
      console.log("✅ Sent MLLP-framed ACK response");
    });

    socket.on("error", (err) => {
      console.error("❌ HL7 Socket Error:", err);
    });
  });

  server.listen(HL7_PORT, () => {
    console.log(`🚀 Nexcore HL7 Listener running on port ${HL7_PORT}`);
  });

  // ✅ File Watcher
  const processedFiles = new Set<string>();
  chokidar.watch(SAVE_DIR, { persistent: true, ignoreInitial: true })
    .on("add", (filePath) => {
      if (filePath.includes(`${SAVE_DIR}\\parsedhl7`)) {
        console.log(`🛑 Ignoring JSON file: ${filePath}`);
        return;
      }

      if (processedFiles.has(filePath)) {
        console.log(`⚠️ Skipping duplicate processing for: ${filePath}`);
        return;
      }

      console.log(`📄 New HL7 file detected: ${filePath}`);
      processedFiles.add(filePath);

      parseHL7(filePath, (hl7FilePath, parsedMessage) => {
        saveAsJSON(hl7FilePath, parsedMessage, `parsedhl7`);
      });

      setTimeout(() => processedFiles.delete(filePath), 10000);
    });

  // ✅ Secure HTTPS Express Server
  const app = express();
  app.get("/", (req, res) => {
    res.send("✅ HL7 Backend Server Running (HTTPS)");
  });

  const certPath = path.resolve(__dirname, "../certs");
  const tlsOptions = {
    key: fs.readFileSync(path.join(certPath, "key.pem")),
    cert: fs.readFileSync(path.join(certPath, "cert.pem")),
    secureProtocol: "TLSv1_2_method",
  };

  https.createServer(tlsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`🔐 HTTPS HL7 Express Server running at https://localhost:${HTTPS_PORT}`);
  });
};
