import path from 'path';
import fs from 'fs';
import { processedFiles } from '../listener'; 
import { GDTFieldMapping } from '../constants/GDTFieldMapping';

/**
 * Converts a JSON object into a GDT-formatted string.
 * @param jsonData The JSON data to convert.
 * @returns A GDT-formatted string.
 */
export function jsonToGDT(jsonData: any): string {
    console.log('[jsonToGDT] Starting GDT generation...');
    console.log('[jsonToGDT] JSON data received:', JSON.stringify(jsonData, null, 2));

    const gdtLines: string[] = [];

  
    gdtLines.push('01380006302', '014810000264');

 
    Object.entries(GDTFieldMapping).forEach(([gdtKey, jsonKey]) => {
        console.log(`[jsonToGDT] Processing GDT key: ${gdtKey}, JSON key: ${jsonKey}`);

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
                    console.log(`[jsonToGDT] Transformed date of birth (3103): ${value}`);
                } else {
                    console.warn(`[jsonToGDT] Invalid date format for key 3103: ${value}`);
                    value = ''; 
                }
            }

            // Calculate the line length: 3 (prefix) + gdtKey.length + value.length + 2 (CR+LF)
            const lineLength = 3 + gdtKey.length + value.length + 2; // Add 2 for CR+LF
            const linePrefix = lineLength.toString().padStart(3, '0'); // Ensure it's a 3-digit prefix
            const gdtLine = `${linePrefix}${gdtKey}${value}`; // Construct the GDT line

            gdtLines.push(gdtLine); // Add the GDT line to the array
            console.log(`[jsonToGDT] Found value for key ${gdtKey}: ${value}`);
        } else {
            console.warn(`[jsonToGDT] No value found for key ${gdtKey}. Skipping.`);
        }
    });

    // Add footer line
    gdtLines.push('0138402null');

    console.log('[jsonToGDT] Generated GDT lines:', gdtLines);
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
            // Delete individual file
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
