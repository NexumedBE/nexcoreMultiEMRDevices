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

    const mappings: { [key: string]: { type: string, documentation: string } } = {};

    // Function to process 'choice' elements correctly
    const processChoice = (choice: any, parentPath: string) => {
      if (choice['xsd:choice']) {
        choice['xsd:choice'].forEach((subChoice: any) => {
          if (subChoice['xsd:element']) {
            subChoice['xsd:element'].forEach((element: any) => {
              const elementName = element['$'].name;
              const elementType = element['$'].type || element['$'].ref || 'unknown';
              const path = `${parentPath}/choice/${elementName}`;

              mappings[path] = {
                type: elementType,
                documentation: extractDocumentation(element)
              };

              // Handle nested complexType inside element
              if (element['xsd:complexType']) {
                parseComplexType(element['xsd:complexType'][0], path);
              }
            });
          }
        });
      }
    };

    // Recursive function to parse complex types and build the path-based mapping
    const parseComplexType = (complexType: any, parentPath: string) => {
      if (complexType['xsd:sequence']) {
        complexType['xsd:sequence'].forEach((sequence: any) => {
          if (sequence['xsd:element']) {
            sequence['xsd:element'].forEach((element: any) => {
              const elementName = element['$'].name;
              const elementType = element['$'].type || element['$'].ref || 'unknown';
              const path = `${parentPath}/${elementName}`;

              mappings[path] = {
                type: elementType,
                documentation: extractDocumentation(element)
              };

              // Handle nested complexType inside element
              if (element['xsd:complexType']) {
                parseComplexType(element['xsd:complexType'][0], path);
              }

              // Handle 'choice' elements inside the 'sequence'
              if (element['xsd:choice']) {
                processChoice(element, path);
              }
            });
          }
        });
      }

      // Handle other structures like 'choice' directly inside complexType
      if (complexType['xsd:choice']) {
        processChoice(complexType, parentPath);
      }
    };

    // Extract documentation as a string (not an array)
    const extractDocumentation = (element: any): string => {
      if (element['xsd:annotation'] && element['xsd:annotation'][0]['xsd:documentation']) {
        const docs = element['xsd:annotation'][0]['xsd:documentation'];
        return Array.isArray(docs) ? docs.join(' ') : docs;
      }
      return '';
    };

    // Start parsing from the root
    if (schema['xsd:complexType']) {
      schema['xsd:complexType'].forEach((complexType: any) => {
        const typeName = complexType['$'].name;
        const basePath = `/${typeName}`;
        mappings[basePath] = {
          type: typeName,
          documentation: extractDocumentation(complexType)
        };
        parseComplexType(complexType, basePath);
      });
    }

    // Write the mappings to a JSON file
    const outputFilePath = path.join(__dirname, '../data/mappings.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(mappings, null, 2));

    console.log('Mapping generation complete! Check the mappings.json file.');
  } catch (error) {
    console.error('Error generating mappings:', error);
  }
};

generatePathBasedMapping();
