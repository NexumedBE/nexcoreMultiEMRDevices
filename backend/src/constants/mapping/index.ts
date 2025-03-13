import {RosettaPIDFieldMapping} from './rosetta2PID';
import {RosettaMSHFieldMapping} from './rosetta3MSH';
import {RosettaPV1FieldMapping} from './rosetta4PV1';
import {RosettaORCFieldMapping} from './rosetta5ORC';
import {RosettaOBRFieldMapping} from './rosetta6OBR';
import {RosettaOBXFieldMapping} from './rosetts7OBX';

export const allMappings = [
    RosettaPIDFieldMapping, 
    RosettaMSHFieldMapping, 
    RosettaPV1FieldMapping, 
    RosettaORCFieldMapping, 
    RosettaOBRFieldMapping, 
    RosettaOBXFieldMapping 
];
