import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

// Define the interface for the expected structure of complex type mappings
interface Mapping {
    type: string;
    occurrences: string;
    [key: string]: any;
}

// Define the function to parse complexType and extract its elements
function parseComplexType(complexType: any): any {
    let result: any = {};

    // Handle xsd:sequence elements
    if (complexType['xsd:sequence']) {
        complexType['xsd:sequence'].forEach((seq: any) => {
            if (seq['xsd:element']) {
                seq['xsd:element'].forEach((element: any) => {
                    const elementName = element['$']?.name;
                    const elementType = element['$']?.type;
                    const minOccurs = element['$']?.minOccurs || '1';  // Default to 1 if not defined
                    const maxOccurs = element['$']?.maxOccurs || '1';  // Default to 1 if not defined

                    // Handle elements found in sequences
                    if (elementName && elementType) {
                        result[elementName] = { type: elementType, occurrences: `${minOccurs}-${maxOccurs}` };
                    }
                });
            }
        });
    }

    return result;
}

// Load and parse the XSD file
const filePath = path.join(__dirname, '../data/kmehr-1_41.xsd');
const parser = new xml2js.Parser();

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the XSD file:', err);
        return;
    }

    parser.parseString(data, (err, result) => {
        if (err) {
            console.error('Error parsing the XSD file:', err);
            return;
        }

        console.log('XSD file parsed successfully:', result);

        const schema = result['xsd:schema'];
        const mappings: { [key: string]: Mapping } = {};

        // Parse all complexType definitions
        if (schema['xsd:complexType']) {
            schema['xsd:complexType'].forEach((complexType: any) => {
                const name = complexType['$'].name;
                console.log(`Parsing complexType: ${name}`);
                mappings[name] = parseComplexType(complexType);
            });
        }

        // Handle the case where there are no complex types or elements
        if (Object.keys(mappings).length === 0) {
            console.log('No complex types found in the XSD file');
        } else {
            // Write the mappings to a JSON file
            const outputPath = path.join(__dirname, '../data/mappings.json');
            fs.writeFileSync(outputPath, JSON.stringify(mappings, null, 2), 'utf8');
            console.log('Mapping generation complete!');
        }
    });
});
