import fs from "fs";

export function parseFHIR(filePath: string, callback: (fhirFilePath: string, parsedMessage: any) => void) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`[parseFHIR] Error reading FHIR file: ${filePath}`, err);
      return;
    }

    try {
      const parsedData = JSON.parse(data); // FHIR is JSON format
      console.log(`[parseFHIR] Successfully parsed FHIR file: ${filePath}`);
      callback(filePath, parsedData);
    } catch (error) {
      console.error(`[parseFHIR] Error parsing FHIR JSON: ${filePath}`, error);
    }
  });
}
