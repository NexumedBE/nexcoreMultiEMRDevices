export function parseGDT(data: string): any {
    // Split the input data into lines and clean it up
    const lines = data.split('\n').map((line) => line.trim()).filter(Boolean); // Remove empty lines
    const result: { [key: string]: string } = {}; // Initialize the result object

    lines.forEach((line) => {
        // Extract the declared line length and the actual length
        const lineLength = parseInt(line.slice(0, 3), 10); // First 3 characters represent the length
        let actualLength = line.length;

        // Adjust actual length if the line does not end with CR+LF
        if (!line.endsWith('\r\n')) {
            actualLength += 2;
        }

        // Extract field number and contents
        const fieldNumber = line.slice(3, 7); // Characters 3-6 represent the field number
        const fieldContents = line.slice(7, lineLength - 2); // Characters after field number until declared length, excluding CR+LF

        // Map field contents to the result using the field number as the key
        result[fieldNumber] = fieldContents;
    });

    // Log the parsed data for debugging purposes
    console.log('Parsed GDT Data:', result);

    // Return the parsed result object
    return result;
}
