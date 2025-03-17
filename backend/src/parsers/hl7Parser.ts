import { allMappings } from '../constants/mapping';  // Import all mappings
import fs from 'fs';
import path from 'path';

const Hl7lib = require('nodehl7');  // HL7 parsing library

/**
 * Parses an HL7 file and dynamically maps its segments to GDT, XML, KMEHR, and FHIR.
 * @param filePath The file path to the HL7 file to parse.
 * @param saveAsJSON A callback function to save the parsed message as JSON.
 */
export function parseHL7(filePath: string, saveAsJSON: (filePath: string, parsedMessage: any) => void) {
    const config = {
        mapping: false, 
        profiling: true,
        debug: true,
        fileEncoding: 'iso-8859-1',
    };

    const hl7parser = new Hl7lib(config);

    // Parse the HL7 file
    hl7parser.parseFile(filePath, (err: Error | null, message: any) => {
        if (err) {
            console.error('Error parsing HL7 file:', err);
            return;
        }

        console.log('Parsed HL7 Message:');
        const parsedMessage: any = {};

        // Iterate over each segment (MSH, PID, ORC, etc.)
        message.segments.forEach((segment: any) => {
            const segmentType = segment.typeofSegment;
            console.log(`\nSegment: ${segmentType}`);

            // Find corresponding mapping from allMappings
            const segmentMapping = allMappings.find(mapping => mapping[segmentType]);

            if (!segmentMapping) {
                console.warn(`[parseHL7] No mapping found for segment: ${segmentType}`);
                return;
            }

            // Ensure the segment type is stored in the parsedMessage
            if (!parsedMessage[segmentType]) {
                parsedMessage[segmentType] = [];
            }

            const segmentObject: any = {};

            // Iterate over each field in the segment
            segment.parts.forEach((part: any, index: number) => {
                const hl7FieldNumber = `${segmentType}${index + 1}`;  // Generate HL7 field key
                const fieldInfo = segmentMapping[hl7FieldNumber];

                // if (fieldInfo) {
                //     console.log(`${hl7FieldNumber} (${fieldInfo.description}): ${part}`);

                //     segmentObject[fieldInfo.HL7] = {
                //         fieldName: fieldInfo.description,
                //         value: part,
                //         mapped: {
                //             GDT: fieldInfo.GDT || '',
                //             XMLcarecon: fieldInfo.XMLcarecon || '',
                //             KMEHR: fieldInfo.KMEHR || '',
                //             FHIR: fieldInfo.FHIR || '',
                //         }
                //     };
                // } else {
                //     console.warn(`[parseHL7] No mapping found for field ${hl7FieldNumber}`);
                // }
            });

            // Add parsed segment to message
            parsedMessage[segmentType].push(segmentObject);
        });

        // Save as JSON
        saveAsJSON(filePath, parsedMessage);
    });
}
