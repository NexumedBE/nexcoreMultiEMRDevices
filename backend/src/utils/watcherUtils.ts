import fs from "fs";
import path from "path";
import { debounce } from "lodash";
// import { parseHL7 } from "../parsers/hl7Parser";
import { parseXML } from "../parsers/xmlParser";
import { parseGDT } from "../parsers/gdtParser";
import { parseFHIR } from "../parsers/fhirParser"; 
import { saveGDTFile, jsonToMesiGDT, parseFHIRtoGDT } from "../fileConverters/GDTGeneratorMesi";
import { saveAsJSON } from "../utils/saveAsJSON";
import { setListenersActive } from "../routes/checkListeners";
import { generateKMEHR } from "../fileConverters/KMEHRGenerators"
import { stopWatchers as stopAllWatchers } from "../utils/watcherManager"; 

export let watchers: any[] = [];
export let mesiWatcher: any = null;


// Debounce file processing to avoid duplicate processing
export const debouncedProcessFile = debounce((filePath: string, source: string, targetDevice: string, emr: string) => {
  processFile(filePath, source, targetDevice, emr);
}, 100);

// Processed files tracking
export const processedFiles = new Set<string>();

export function processFile(filePath: string, source: string, targetDevice: string, emr: string) {
  console.log(`[processFile] Start processing file: ${filePath} from source: ${source} -> Target Device: ${targetDevice}`);

  if (processedFiles.has(filePath)) {
    console.warn(`[processFile] File already processed: ${filePath}`);
    return;
  }
  processedFiles.add(filePath);

  const fileExtension = path.extname(filePath).toLowerCase();

  // Ensure MESI does not process files from its own output folder
  if (filePath.startsWith("C:\\MESI services\\MESI mTABLET GDT Integration Service\\Input")) {
    console.log(`[processFile] Ignoring file from MESI output folder: ${filePath}`);
    return;
  }

  switch (fileExtension) {
    case ".hl7":
      console.log(`[processFile] Detected .hl7 file: ${filePath}`);
      // parseHL7(filePath, (hl7FilePath, parsedMessage) => {
      //   const hl7JSON = saveAsJSON(hl7FilePath, parsedMessage, `parsedhl7-${source}`);
        
      //   if (targetDevice === "MESI") {
      //       saveGDTFile(parsedMessage, hl7FilePath);
      //       console.log("🤷‍♂️🤷‍♂️", hl7JSON)
      //   }
      // });
      break;

      case ".xml":
        console.log(`[processFile] Detected .xml file: ${filePath} from ${source}`);
      
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(`[processFile] Error reading XML file: ${filePath}`, err);
            return;
          }
      
          parseXML(data, (parsedMessage) => {
            saveAsJSON(filePath, parsedMessage, `parsedxml-${source}`);
      
            const parsedJsonPath = path.join(
              path.dirname(filePath),
              `parsedxml-${source}`,
              `${path.basename(filePath, path.extname(filePath))}.json`
            );
      
            fs.readFile(parsedJsonPath, "utf8", (err, jsonData) => {
              if (err) {
                console.error(`[processFile] Error reading JSON file: ${parsedJsonPath}`, err);
                return;
              }
      
              const parsedJson = JSON.parse(jsonData);
              console.log(`[processFile] Successfully read parsed JSON file: ${parsedJsonPath}`);
      
              // ✅ Process file based on target device
              if (targetDevice === "MESI") {
                console.log(`[processFile] Converting XML to MESI GDT format...`);
                const gdtContent = jsonToMesiGDT(parsedJson);
                saveGDTFile(filePath, gdtContent);
              } else if (targetDevice === "BAXTER") {
                console.log(`[processFile] Saving parsed JSON to emrJSON folder for BAXTER...`);
              
                const patient = parsedJson?.Message?.Document?.Patient;
                if (patient) {
                  const inssId = patient.ID?.find((id: any) => id.IDSystem === "INSS")?._ || "(INSS not found)";
                  const firstName = patient.Name?.FirstName || "(No First Name)";
                  const lastName = patient.Name?.LastName || "(No Last Name)";
                  let dob = patient.DateOfBirth || "";
                    if (dob.includes("/")) {
                      const [day, month, year] = dob.split("/");
                      dob = `${year}${month}${day}`; // YYYYMMDD
                    } else {
                      dob = "(No DOB)";
                    }
                  const gender = patient.Sex?.charAt(0).toUpperCase() || "U";
              
                  console.log(`[BAXTER] Patient INSS ID: ${inssId}`);
                  console.log(`[BAXTER] Patient Name: ${firstName} ${lastName}`);
              
                  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14); // YYYYMMDDHHMMSS
              
                  const message = [
                    `MSH|^~\\&|CSM|WelchAllyn|EMR|HIS|${timestamp}-0000||RSP^ZV2^RSP_ZV2|${timestamp}001|P|2.6|||AL|NE`,
                    `MSA|AA|${timestamp}000`,
                    `QAK|${timestamp}000|OK`,
                    `QPD|IHE PDVQ Query|${timestamp}001|@PV1.3^Ward 2|Ward2|100033241216`,
                    `PID|||${inssId}||${lastName}^${firstName}||${dob}|${gender}`,
                    `PV1|1|I|Ward 2^Room^Bed`
                  ].join("\r");
                  
              
                  console.log("[BAXTER] Generated HL7 message:\n" + message);
              
                  // Save HL7 message to parsed-xmlToHl7
                  const hl7Dir = path.join(path.dirname(filePath), "parsed-xmlToHl7");
                  if (!fs.existsSync(hl7Dir)) {
                    fs.mkdirSync(hl7Dir, { recursive: true });
                    console.log(`[BAXTER] Created directory: ${hl7Dir}`);
                  }
              
                  const hl7FilePath = path.join(hl7Dir, `${path.basename(filePath, path.extname(filePath))}.hl7`);
                  fs.writeFileSync(hl7FilePath, message, "utf8");
                  console.log(`[BAXTER] HL7 file saved at: ${hl7FilePath}`);
                } else {
                  console.warn(`[BAXTER] ⚠️ No patient data found in parsed JSON.`);
                }
              }else {
                console.warn(`[processFile] Skipping XML conversion for ${source} (Detected Target: ${targetDevice})`);
              }
              
            });
          });
        });
      break;
      
      case ".json":
        console.log(`[processFile] Detected .json file: ${filePath}`);

        parseFHIR(filePath, (fhirFilePath, parsedMessage) => {
            console.log(`[processFile] Parsed JSON file: ${fhirFilePath}`);

            // Save parsed JSON
            saveAsJSON(fhirFilePath, parsedMessage, `parsedJSON-${source}`);

            // Constructing the new file path
            let parentDir = path.dirname(filePath);

              // Prevent adding parsedfhir-MESI recursively
              if (!parentDir.includes(`parsedJSON-${source}`)) {
                parentDir = path.join(parentDir, `parsedJSON-${source}`);
              }

              const parsedJsonPath = path.join(
                parentDir,
                `${path.basename(filePath, path.extname(filePath))}.json`
              );

            console.log(`[processFile] Expected parsed JSON path: ${parsedJsonPath}`);

            fs.readFile(parsedJsonPath, "utf8", (err, jsonData) => {
                if (err) {
                    console.error(`[processFile] Error reading JSON file: ${parsedJsonPath}`, err);
                    return;
                }

                const parsedJson = JSON.parse(jsonData);
                console.log(`[processFile] Successfully read parsed JSON file: ${parsedJsonPath}`);

                if (targetDevice === "MESI") {
                    console.log(`[processFile] Converting XML to GDT for CC...`);
                    const gdtMesi = parseFHIRtoGDT(parsedJson);
                    saveGDTFile(filePath, gdtMesi);
                    console.log(JSON.stringify(parsedJson, null, 2));
                } else {
                    console.warn(`[processFile] Skipping XML processing for JSON from ${source}`);
                }
            });
        });
        break;


      case ".gdt":
        console.log(`[processFile] Detected .gdt file: ${filePath}`);
      
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(`[processFile] Error reading GDT file: ${filePath}`, err);
            return;
          }
      
          const parsedMessage = parseGDT(data);
          saveAsJSON(filePath, parsedMessage, `parsedgdt-${source}`);
      
          const parsedJsonPath = path.join(
            path.dirname(filePath),
            `parsedgdt-${source}`,
            `${path.basename(filePath, path.extname(filePath))}.json`
          );
      
          fs.readFile(parsedJsonPath, "utf8", (err, jsonData) => {
            if (err) {
              console.error(`[processFile] Error reading JSON file: ${parsedJsonPath}`, err);
              return;
            }
      
            const parsedJson = JSON.parse(jsonData);
      
            // ✅ Only call `generateKMEHR()` if the source is CareConnect
            if (emr === "CareConnect") {
              generateKMEHR(parsedJson);
            } else if (emr === "Sanday") {
              // sanday logic will go here
              console.log("🏒 Sanday logic will run");
            }else {
              console.warn(`[processFile] Skipping KMEHR generation for GDT from ${source}`);
            }
          });
        });
        break;
      

    default:
      console.warn(`[processFile] Unknown file format from: ${source}: ${fileExtension}`);
  }
}

export const stopWatchers = () => {
  console.log("⏹ Stopping all file listeners...");

  stopAllWatchers(); // ✅ Call the centralized stop function
};