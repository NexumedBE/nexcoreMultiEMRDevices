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
              } else {
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