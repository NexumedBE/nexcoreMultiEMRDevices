import * as fs from 'fs';
import * as path from 'path';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseStringPromise = promisify(parseString);
const xsdFilePath = path.join(__dirname, '../data/kmehr-1_41.xsd');

const generatePathBasedMapping = async () => {
  try {
    const xsdData = fs.readFileSync(xsdFilePath, 'utf8');
    const result: any = await parseStringPromise(xsdData); // Explicitly cast to any type
    const schema = result['xsd:schema'];
    
    if (!schema) {
      throw new Error('Schema not found in XSD');
    }

    const mappings = new Map<string, string>(); // Use a Map to preserve order

    // Recursive function to parse complex types and build the path-based mapping
    const parseComplexType = (complexType: any, parentPath: string) => {
      if (complexType['xsd:sequence']) {
        complexType['xsd:sequence'].forEach((sequence: any) => {
          if (sequence['xsd:element']) {
            sequence['xsd:element'].forEach((element: any) => {
              const elementName = element['$'].name;
              const elementType = element['$'].type || element['$'].ref || 'unknown';
              const path = `${parentPath}/${elementName}`;

              mappings.set(path, elementType); // Use `set` to insert in order

              // If the element is complex, recurse into it
              if (element['xsd:complexType']) {
                parseComplexType(element['xsd:complexType'][0], path);
              }
            });
          }
        });
      }
    };

    // Start parsing from the root
    if (schema['xsd:complexType']) {
      schema['xsd:complexType'].forEach((complexType: any) => {
        const typeName = complexType['$'].name;
        const basePath = `/${typeName}`;
        mappings.set(basePath, typeName); // Add base type to the map
        parseComplexType(complexType, basePath);
      });
    }

    // Write the mappings to a JSON file
    const outputFilePath = path.join(__dirname, '../data/mappings.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(Object.fromEntries(mappings), null, 2)); // Convert Map to object for JSON output

    console.log('Mapping generation complete! Check the mappings.json file.');
  } catch (error) {
    console.error('Error generating mappings:', error);
  }
};

generatePathBasedMapping();
