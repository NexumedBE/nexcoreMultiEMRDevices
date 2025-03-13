declare module 'nodehl7' {
    export class HL7Message {
      static parse(data: string): any;
    }
  }