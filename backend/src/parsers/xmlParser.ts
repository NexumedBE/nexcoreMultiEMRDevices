import { parseString } from 'xml2js'; // Import the xml2js library to parse XML data

/**
 * Parses XML data into a JSON object and passes it to a callback function.
 * @param data The raw XML content as a string.
 * @param callback A function to handle the parsed result or error.
 */
export function parseXML(data: string, callback: (parsedMessage: any) => void) {
  console.log('Parsing XML content...');

  // Define parser options for xml2js to control how XML is converted to JSON
  const parserOptions = {
    explicitArray: false, // Prevent arrays for single-element nodes
    ignoreAttrs: false,   // Include XML attributes in the parsed output
    tagNameProcessors: [
      (name: string) => name.replace(/.*:/, '') // Remove namespaces from tag names
    ],
    mergeAttrs: true,     // Merge attributes into the parent object
  };

  // Use xml2js to parse the XML string
  parseString(data, parserOptions, (err, result) => {
    if (err) {
      // Log and handle errors during parsing
      console.error('Error parsing XML:', err);
      callback(null); // Notify the callback with a null value on error
      return;
    }

    // Pass the parsed JSON object to the callback
    // console.log can be uncommented for debugging purposes
    // console.log('Parsed XML to JSON:', JSON.stringify(result, null, 2));
    callback(result);
  });
}

