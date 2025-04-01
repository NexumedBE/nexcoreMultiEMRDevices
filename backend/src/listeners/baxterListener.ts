import chokidar from "chokidar";
import net from "net";
import fs from "fs";
import path from "path";
import https from "https";
import express from "express";
import { parseHL7 } from "../parsers/hl7Parser";
import { saveAsJSON } from "../utils/saveAsJSON";
import { debouncedProcessFile } from "../utils/watcherUtils";
import { generateKMEHRFromHL7 } from "../fileConverters/KMEHRGenerators"

const HL7_PORT = 281;
const HTTPS_PORT = 4344;
const SAVE_DIR = "C:\\Nexumed\\baxter";
const nexumedInFolder = path.join("C:\\Nexumed", "nexumedIn");

if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR, { recursive: true });
}


function getUTCFormattedTimestamp() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hour = String(now.getUTCHours()).padStart(2, "0");
  const minute = String(now.getUTCMinutes()).padStart(2, "0");
  const second = String(now.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hour}${minute}${second}+0000`;
}

export const startBaxterListener = (emr: string) => {
  console.log("💥 startBaxterListener called with EMR:", emr);

  const watcher = chokidar.watch(nexumedInFolder, {
    persistent: true,
    ignored: [/parsedhl7|parsedxml|parsedgdt|parsedJSON-.*/i],
  });
  
  watcher.on("ready", () => {
    console.log("✅ [startBaxterListener] Watcher ready for nexumedIn");
  });
  
  watcher.on("add", (filePath) => {
    console.log(`[startBaxterListener] New file detected in nexumedIn: ${filePath}`);
    debouncedProcessFile(filePath, "nexumedIn", "BAXTER", emr);
  });
  
  watcher.on("error", (error) => {
    console.error(`❌ [startBaxterListener] Error in nexumedIn watcher: ${error}`);
  })

  const server = net.createServer((socket) => {
    console.log(`[${new Date().toISOString()}] 📡 HL7 Connection established`);

    // socket.write(baxterResponseHL7);
    // console.log(`[${new Date().toISOString()}] 🚀 Sent initial HL7 message to Baxter`);

    let buffer = "";

    socket.on("data", (data) => {
      buffer += data.toString();
      console.log("⚾ Raw data received:", data.toString());

      const startIdx = buffer.indexOf("\x0B");
      const endIdx = buffer.indexOf("\x1C\r");

      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const rawMessage = buffer.slice(startIdx + 1, endIdx);
        const timestamp = getUTCFormattedTimestamp();
        const controlId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 17);
        buffer = buffer.slice(endIdx + 2); // prepare for more HL7s in the same socket

        const formattedMessage = rawMessage
          .replace(/(MSA|MSH|OBR|OBX|ORC|PID|PV1|QAK|QPD|QRD)/g, "\r\n$1")
          .replace(/^\r\n/, "");

        console.log("📥 Received HL7 Message:\n", formattedMessage);

        const filePath = path.join(SAVE_DIR, `hl7_message_${timestamp}.hl7`);
        fs.writeFileSync(filePath, formattedMessage, "utf8");
        console.log(`✅ HL7 Message saved to: ${filePath}`);


        const xmlHl7Dir = path.join(SAVE_DIR, "../nexumedIn/parsed-xmlToHl7")


        fs.readdir(xmlHl7Dir, (err, files) => {
          if (err) {
            console.error(`[BAXTER] ❌ Error reading parsed-xmlToHl7 folder: ${err.message}`);
            return;
          }
        
          const hl7Files = files
            .filter((f) => f.endsWith(".hl7"))
            .map((f) => ({
              name: f,
              time: fs.statSync(path.join(xmlHl7Dir, f)).mtime.getTime(),
            }))
            .sort((a, b) => b.time - a.time);
        
          if (hl7Files.length === 0) {
            console.warn("[BAXTER] ⚠️ No HL7 files found in parsed-xmlToHl7 to send.");
        
            const ackMessage =
              "\x0B" +
              `MSH|^~\\&|EMR|HIS|CSM|WelchAllyn|${timestamp}||ACK^A01|${controlId}|P|2.6|||AL|NE\r` +
              `MSA|AA|${controlId}\r` +
              "\x1C\r";
        
            socket.write(ackMessage);
            console.log("✅ Sent HL7 ACK message:\n", ackMessage);
        
            return;
          }
        
          const latestFilePath = path.join(xmlHl7Dir, hl7Files[0].name);
          const hl7Content = fs.readFileSync(latestFilePath, "utf8");
          const wrappedMessage = "\x0B" + hl7Content + "\x1C\r";
        
          socket.write(wrappedMessage);
          console.log(`[BAXTER] 🏒🏒🏒🏒🏒 Sent HL7 message from: ${latestFilePath}`);

          hl7Files.forEach(({ name }) => {
            const fileToDelete = path.join(xmlHl7Dir, name);
            try {
              fs.unlinkSync(fileToDelete);
              console.log(`🧹 Deleted: ${fileToDelete}`);
            } catch (err) {
              if (err instanceof Error) {
                console.error(err.message);
              } else {
                console.error(err);
              }
            }
          });
        });
      }
    });

    socket.on("error", (err) => {
      console.error("❌ HL7 Socket Error:", err);
    });
  });

  server.listen(HL7_PORT, "192.168.1.36", () => {
    console.log(`🚀 Nexcore HL7 Listener running on 192.168.1.36:${HL7_PORT}`);
  });

  const processedFiles = new Set<string>();

  chokidar.watch(SAVE_DIR, { persistent: true, ignoreInitial: true }).on("add", (filePath) => {
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
      generateKMEHRFromHL7(parsedMessage);
    });

    // setTimeout(() => processedFiles.delete(filePath), 10000);
  });

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



// function getUTCFormattedTimestamp() {
//   const now = new Date();

//   const year = now.getUTCFullYear();
//   const month = String(now.getUTCMonth() + 1).padStart(2, '0');
//   const day = String(now.getUTCDate()).padStart(2, '0');
//   const hour = String(now.getUTCHours()).padStart(2, '0');
//   const minute = String(now.getUTCMinutes()).padStart(2, '0');
//   const second = String(now.getUTCSeconds()).padStart(2, '0');

//   return `${year}${month}${day}${hour}${minute}${second}+0000`;
// }


// const timestamp = getUTCFormattedTimestamp();

          // console.log("📑 Parsed HL7 segments:");
          // formattedMessage.split(/\r?\n/).forEach((segment) => {
          //   if (segment.trim()) console.log(`🔹 ${segment}`);
          // });

          // const pidSegment = formattedMessage.split(/\r?\n/).find((line) => line.startsWith("PID|"));
          // if (pidSegment) {
          //   const fields = pidSegment.split("|");
          //   const patientId = fields[3] || "(no ID)";
          //   const patientName = fields[5] || "(no name)";
          //   const dob = fields[7] || "(no DOB)";
          //   const gender = fields[8] || "(no gender)";

          //   console.log(" Patient Info:");
          //   console.log(`   ID:        ${patientId}`);
          //   console.log(`   Name:      ${patientName}`);
          //   console.log(`   DOB:       ${dob}`);
          //   console.log(`   Gender:    ${gender}`);
          // } else {
          //   console.warn("⚠️ No PID segment found.");
          // }

          
        // const ackFilePath = path.join(SAVE_DIR, `ack_${timestamp}.hl7`);
        // fs.writeFileSync(ackFilePath, ackMessage, "utf8");
        // console.log(`📝 ACK message also saved to: ${ackFilePath}`);

        // const baxterResponseHL7 = 
//   "\x0B" +
//   "MSH|^~\\&|CSM|WelchAllyn|EMR|HIS|20140123094559-0500||RSP^K22|20140123094559728|P|2.6|||AL|NE\r" +
//   "MSA|AA|20140122123838853\r" +
//   "QAK|20140122123838853|OK\r" +
//   "QPD|PatientQuery|20140123094459728|@PID.3.1^135798642|Ward2|100033241216\r" +
//   "PID|||135798642||Eastwood^Clint||19780423|M\r" +
//   "\x1C\r";