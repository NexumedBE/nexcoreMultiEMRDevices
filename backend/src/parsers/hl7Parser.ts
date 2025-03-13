import { 
  MSHFieldMapping, 
  PIDFieldMapping, 
  ORCFieldMapping, 
  OBRFieldMapping, 
  PV1FieldMapping, 
  OBXFieldMapping 
} from '../constants'; 

import fs from 'fs';
import path from 'path';

const Hl7lib = require('nodehl7'); 

// Base numbers for dynamic key generation for each HL7 segment type
const SegmentBaseNumbers: Record<string, number> = {
  MSH: 302000, 
  PID: 200000, 
  ORC: 500000,
  OBR: 600000, 
  PV1: 400000, 
  OBX: 700000  
};

// Segment-to-field mapping for different HL7 segments
const segmentFields: Record<string, Record<string, string>> = {
  MSH: MSHFieldMapping, 
  PID: PIDFieldMapping, 
  ORC: ORCFieldMapping, 
  OBR: OBRFieldMapping, 
  PV1: PV1FieldMapping, 
  OBX: OBXFieldMapping  
};

/**
 * Parses an HL7 file and maps its segments and fields dynamically.
 * Saves the parsed message as JSON.
 * @param filePath The file path to the HL7 file to parse.
 * @param saveAsJSON A callback function to save the parsed message as JSON.
 */
export function parseHL7(filePath: string, saveAsJSON: (filePath: string, parsedMessage: any) => void) {
  // Configuration options for the HL7 parser
  const config = {
    mapping: false,        // Disable default mapping
    profiling: true,       // Enable profiling for debugging
    debug: true,           // Enable debug logging
    fileEncoding: 'iso-8859-1', // Specify file encoding
  };

  const hl7parser = new Hl7lib(config); // Initialize the HL7 parser

  // Parse the HL7 file
  hl7parser.parseFile(filePath, (err: Error | null, message: any) => {
    if (err) {
      console.error('Error parsing HL7 file:', err); // Log parsing errors
      return;
    }

    console.log('Parsed HL7 Message:');
    const parsedMessage: any = {}; // Object to store the parsed message

    // Iterate over each segment in the HL7 message
    message.segments.forEach((segment: any) => {
      const segmentType = segment.typeofSegment; // Get the segment type (e.g., MSH, PID)
      console.log(`\nSegment: ${segmentType}`);

      // Get the base number for the segment type
      const baseNumber = SegmentBaseNumbers[segmentType] || 0;

      // Get the field mapping for the segment type
      const fieldMapping = segmentFields[segmentType] || {};

      // Ensure the segment type is stored as an array in the parsedMessage object
      if (!parsedMessage[segmentType]) {
        parsedMessage[segmentType] = [];
      }

      const segmentObject: any = {}; // Object to store the parsed fields for this segment

      // Iterate over each part (field) in the segment
      segment.parts.forEach((part: any, index: number) => {
        // Generate a numeric key dynamically based on the index
        const numericKey = `${baseNumber + index * 1000}`;
        const fieldName = fieldMapping[numericKey] || `Unnamed Field ${index}`; // Get the field name or fallback

        console.log(`${numericKey} (${fieldName}): ${part}`);
        segmentObject[numericKey] = {
          fieldName: fieldName, // Field name from mapping
          value: part,          // Actual value of the field
        };
      });

      // Add the parsed segment object to the array for that segment type
      parsedMessage[segmentType].push(segmentObject);
    });

    // Save the parsed message as JSON using the provided callback
    saveAsJSON(filePath, parsedMessage);
  });
}