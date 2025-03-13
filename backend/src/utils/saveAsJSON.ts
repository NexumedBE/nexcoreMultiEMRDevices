import path from 'path';
import fs from 'fs';

/**
 * Saves a parsed message as a JSON file in a specified subfolder.
 * Handles folder creation and ensures unique file names if duplicates exist.
 * @param filePath The original file path used to determine the save location.
 * @param parsedMessage The parsed data object to save as a JSON file.
 * @param outputSubFolder The name of the subfolder where the JSON file will be saved.
 */
export function saveAsJSON(filePath: string, parsedMessage: any, outputSubFolder: string) {
  // Define the output folder path based on the original file's directory and the subfolder name
  const outputFolder = path.join(path.dirname(filePath), outputSubFolder);
  console.log(`a json file has been put here" ${outputFolder}`);
  // Create the output folder if it doesn't already exist
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder); // Create the folder
    console.log(`Created output folder at: ${outputFolder}`); // Log folder creation
  }

  // Determine the base name of the original file (without extension)
  const baseName = path.basename(filePath, path.extname(filePath));

  // Construct the initial JSON file path
  let jsonFilePath = path.join(outputFolder, `${baseName}.json`);
  let counter = 1; // Initialize a counter for handling duplicate file names

  // Check if a file with the same name already exists, and append a counter if needed
  while (fs.existsSync(jsonFilePath)) {
    jsonFilePath = path.join(outputFolder, `${baseName}-${counter}.json`); // Append counter to file name
    counter++; // Increment the counter
  }

  try {
    // Save the parsed message as a JSON file with 2-space indentation
    fs.writeFileSync(jsonFilePath, JSON.stringify(parsedMessage, null, 2));
    console.log(`Saved parsed message as JSON: ${jsonFilePath}`); // Log success
  } catch (err) {
    // Handle errors during the file writing process
    console.error('Error saving JSON file:', err);
  }
}
