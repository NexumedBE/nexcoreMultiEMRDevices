import path from 'path';
import fs from 'fs';
import { processedFiles } from '../utils/watcherUtils'; 
import { GDTFieldMapping } from '../constants/GDTFieldMapping';

/**
 * Converts a JSON object into a GDT-formatted string.
 * @param jsonData The JSON data to convert.
 * @returns A GDT-formatted string.
 */
export function jsonToMesiGDT(jsonData: any): string {
    console.log('[jsonToMesiGDT] Starting GDT generation...');
    console.log('[jsonToMesiGDT] JSON data received:', JSON.stringify(jsonData, null, 2));

    const gdtLines: string[] = [];

  
    gdtLines.push('01380006302', '014810000264');

 
    Object.entries(GDTFieldMapping).forEach(([gdtKey, jsonKey]) => {
        console.log(`[jsonToMesiGDT] Processing GDT key: ${gdtKey}, JSON key: ${jsonKey}`);

        let value = getValueFromJson(jsonData, jsonKey);

        if (value !== undefined) {
            // Special handling for gender
            if (gdtKey === '3110' && value.toLowerCase() === 'male') {
                gdtKey = '31101'; // Replace the key for males
                value = ''; // Clear the value
            } else if (gdtKey === '3110' && value.toLowerCase() === 'female') {
                gdtKey = '31102'; // Replace the key for females
                value = ''; // Clear the value
            }

            if (gdtKey === '3103') {
                const dateParts = value.split('/'); 
                if (dateParts.length === 3) {
                    value = `${dateParts[0]}${dateParts[1]}${dateParts[2]}`; 
                    console.log(`[jsonToMesiGDT] Transformed date of birth (3103): ${value}`);
                } else {
                    console.warn(`[jsonToMesiGDT] Invalid date format for key 3103: ${value}`);
                    value = ''; 
                }
            }

            // Calculate the line length: 3 (prefix) + gdtKey.length + value.length + 2 (CR+LF)
            const lineLength = 3 + gdtKey.length + value.length + 2; // Add 2 for CR+LF
            const linePrefix = lineLength.toString().padStart(3, '0'); // Ensure it's a 3-digit prefix
            const gdtLine = `${linePrefix}${gdtKey}${value}`; // Construct the GDT line

            gdtLines.push(gdtLine); // Add the GDT line to the array
            console.log(`[jsonToMesiGDT] Found value for key ${gdtKey}: ${value}`);
        } else {
            console.warn(`[jsonToMesiGDT] No value found for key ${gdtKey}. Skipping.`);
        }
    });

    // Add footer line
    gdtLines.push('0138402null');

    console.log('[jsonToMesiGDT] Generated GDT lines:', gdtLines);
    return gdtLines.join('\r\n'); // Join lines using Windows-style line endings (\r\n)
}
    

/**
 * Retrieves a nested value from a JSON object using a dot-separated key path.
 * Supports array indexing like `key[0].subkey`.
 * @param jsonData The JSON object to traverse.
 * @param jsonKey A dot-separated string representing the key path.
 * @returns The value as a string if found, otherwise undefined.
 */
export function getValueFromJson(jsonData: any, jsonKey: string): string | undefined {
    const keys = jsonKey.split('.'); // Split the path into parts
    let value = jsonData; // Start with the root JSON object

    for (const key of keys) {
        const arrayMatch = key.match(/^([^\[]+)\[(\d+)\]$/); // Match keys with array indexing
        if (arrayMatch) {
            const arrayKey = arrayMatch[1]; // The array property name
            const arrayIndex = parseInt(arrayMatch[2], 10); // The array index

            if (value && Array.isArray(value[arrayKey])) {
                value = value[arrayKey][arrayIndex]; // Navigate to the specific array element
            } else {
                return undefined; // Return undefined if the array or index doesn't exist
            }
        } else {
            // Regular object key
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined; // Return undefined if the key doesn't exist
            }
        }
    }

    // Return the value if it's a string or number
    return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
}

/**
 * Saves a GDT-formatted string to a file on the desktop in the "nexcoreTranslated" folder.
 * @param filePath The path of the original file.
 * @param gdtContent The GDT content to save.
 */
export function saveGDTFile(filePath: string, gdtContent: string) {
  const outputFolder = 'C:\\MESI services\\MESI mTABLET GDT Integration Service\\Input';

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
    console.log(`Created output folder at: ${outputFolder}`);
  }

  const baseName = path.basename(filePath, path.extname(filePath));
  const gdtFilePath = path.join(outputFolder, `${baseName}.gdt`);

  if (processedFiles.has(gdtFilePath)) {
    console.warn(`[saveGDTFile] File already saved: ${gdtFilePath}`);
    return;
  }

  console.log(`[saveGDTFile] Attempting to save GDT file at: ${gdtFilePath}`);

  try {
    fs.writeFileSync(gdtFilePath, gdtContent);
    processedFiles.add(gdtFilePath);
    console.log(`[saveGDTFile] Successfully saved GDT file: ${gdtFilePath}`);
    cleanNexumedInFolder();
  } catch (err) {
    if (err instanceof Error) {
      console.error(`[saveGDTFile] Error writing GDT file: ${err.message}`);
    } else {
      console.error('[saveGDTFile] Unknown error writing GDT file:', err);
    }
  }
}

  // Function to clean up the `nexumedIn` folder
  function cleanNexumedInFolder() {
    const nexumedInFolder = 'C:\\Nexumed\\nexumedIn';
  
    console.log(`[cleanNexumedInFolder] Cleaning up folder: ${nexumedInFolder}`);
    fs.readdir(nexumedInFolder, (err, files) => {
      if (err) {
        console.error(`[cleanNexumedInFolder] Error reading folder: ${err.message}`);
        return;
      }
  
      files.forEach((file) => {
        const filePath = path.join(nexumedInFolder, file);
        fs.stat(filePath, (statErr, stats) => {
          if (statErr) {
            console.error(`[cleanNexumedInFolder] Error accessing ${filePath}: ${statErr.message}`);
            return;
          }
  
          if (stats.isDirectory()) {
            // Recursively delete the subdirectory
            fs.rm(filePath, { recursive: true, force: true }, (rmErr) => {
              if (rmErr) {
                console.error(`[cleanNexumedInFolder] Error deleting folder ${filePath}: ${rmErr.message}`);
              } else {
                console.log(`[cleanNexumedInFolder] Deleted folder: ${filePath}`);
              }
            });
          } else {
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error(`[cleanNexumedInFolder] Error deleting file ${filePath}: ${unlinkErr.message}`);
              } else {
                console.log(`[cleanNexumedInFolder] Deleted file: ${filePath}`);
              }
            });
          }
        });
      });
    });
  }

  export function parseFHIRtoGDT(fhirData: any): any {
    console.log("[parseFHIRtoGDT] Extracting relevant data from FHIR...");
  
    let gdtData: { [key: string]: string } = {};
  
    if (!fhirData.entry || !Array.isArray(fhirData.entry)) {
      console.error("[parseFHIRtoGDT] Invalid FHIR structure, missing 'entry'.");
      return "";
  }

  // ✅ Extract Patient Information
  const patientEntry = fhirData.entry.find((e: any) => e.resource.resourceType === "Patient");
  if (patientEntry) {
      const patient = patientEntry.resource;
      gdtData["3101"] = patient.name?.[0]?.family || ""; 
      gdtData["3102"] = patient.name?.[0]?.given?.join(" ") || "";  
      gdtData["3103"] = patient.birthDate ? patient.birthDate.replace(/-/g, "") : "";  // Birthdate YYYYMMDD
      if (patient.gender?.toLowerCase() === "male") {
        gdtData["3110"] = "1"; // Assign value 311
    } else if (patient.gender?.toLowerCase() === "female") {
        gdtData["3110"] = "2"; // Assign value 311
    } else {
        gdtData["3110"] = ""; // Default fallback
    }

  const secondaryIdentifier = patient.identifier?.find((id: any) => id.use === "secondary")?.value;
  if (secondaryIdentifier) {
        gdtData["3105"] = secondaryIdentifier;
        console.log(`[parseFHIRtoGDT] Assigned secondary identifier to 3105: ${secondaryIdentifier}`);
    } else {
        console.warn("[parseFHIRtoGDT] No secondary identifier found for Patient.");
    }


      if (patient.extension) {
        const heightExt = patient.extension.find((ext: any) => ext.url.includes("bodyheight"));
        const weightExt = patient.extension.find((ext: any) => ext.url.includes("bodyweight"));
    
        if (heightExt?.valueQuantity?.value) gdtData["3622"] = String(heightExt.valueQuantity.value); 
        if (weightExt?.valueQuantity?.value) gdtData["3623"] = String(weightExt.valueQuantity.value); 

      }
    }


  const practitionerEntry = fhirData.entry.find((e: any) => e.resource.resourceType === "Practitioner");
  if (practitionerEntry) {
      const practitioner = practitionerEntry.resource;
      gdtData["8316"] = practitioner.name?.[0]?.family + " " + (practitioner.name?.[0]?.given?.[0] || ""); 
  }

  const serviceRequestEntry = fhirData.entry.find((e: any) => e.resource.resourceType === "ServiceRequest");
  if (serviceRequestEntry) {
      const serviceRequest = serviceRequestEntry.resource;
      gdtData["8402"] = serviceRequest.code?.coding?.[0]?.display || ""; 
      gdtData["8410"] = serviceRequest.code?.coding?.[0]?.code || "";
      gdtData["8432"] = serviceRequest.authoredOn?.replace(/[-T:]/g, "").slice(0, 8) || ""; // Order Date YYYYMMDD
  }
  
    console.log("[parseFHIRtoGDT] Mapped FHIR data:", gdtData);


      console.log("[parseFHIRtoGDT] Extracting relevant data from FHIR and generating GDT...");
  
      if (!fhirData.entry || !Array.isArray(fhirData.entry)) {
          console.error("[parseFHIRtoGDT] Invalid FHIR structure, missing 'entry'.");
          return;
      }
  
      const gdtLines: string[] = [];
      gdtLines.push('01380006302', '014810000264'); // GDT header

      for (const [gdtKey, value] of Object.entries(gdtData)) {
        let processedValue = value; 
    
        // if (gdtKey === "3110") {
        //     processedValue = processedValue.toLowerCase() === "male" ? "M" : "F";
        // }
    
        if (gdtKey === "3103" || gdtKey === "8432") {
    processedValue = processedValue.replace(/-/g, ""); // Remove hyphens if any
    if (processedValue.length === 8) {
        processedValue = `${processedValue.slice(6, 8)}${processedValue.slice(4, 6)}${processedValue.slice(0, 4)}`; // Convert YYYYMMDD to DDMMYYYY
    }
}
    
        if (processedValue !== "") {
            const lineLength = 3 + gdtKey.length + processedValue.length + 2; // Add 2 for CR+LF
            const linePrefix = lineLength.toString().padStart(3, '0'); 
            const gdtLine = `${linePrefix}${gdtKey}${processedValue}`;
    
            gdtLines.push(gdtLine); 
            console.log(`[parseFHIRtoGDT] Added GDT line: ${gdtLine}`);
        } else {
            console.warn(`[parseFHIRtoGDT] Skipping empty value for key: ${gdtKey}`);
        }
    }
    gdtLines.push("0160102Nexumed");
      console.log(`[parseFHIRtoGDT] Added GDT line: ${gdtLines}`);
      return gdtLines.join('\r\n'); 
  }
  