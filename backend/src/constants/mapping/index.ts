import {RosettaPIDFieldMapping} from './rosetta2PID';
import {RosettaMSHFieldMapping} from './rosetta3MSH';
import {RosettaPV1FieldMapping} from './rosetta4PV1';
import {RosettaORCFieldMapping} from './rosetta5ORC';
import {RosettaOBRFieldMapping} from './rosetta6OBR';
import {RosettaOBXFieldMapping} from './rosetta7OBX';
import {RosettaQRDFieldMapping} from './rosetta8QRD';
import {RosettaMSAFieldMapping} from './rosetta9MSA';
import {RosettaQAKFieldMapping} from './rosetta10QAK';
import {RosettaQPDFieldMapping} from './rosetta11QPD';
import {RosettaRCPFieldMapping} from './rosetta12RCP';

export const allMappings = [
    RosettaPIDFieldMapping, 
    RosettaMSHFieldMapping, 
    RosettaPV1FieldMapping, 
    RosettaORCFieldMapping, 
    RosettaOBRFieldMapping, 
    RosettaOBXFieldMapping,
    RosettaQRDFieldMapping,
    RosettaMSAFieldMapping,
    RosettaQAKFieldMapping,
    RosettaQPDFieldMapping,
    RosettaRCPFieldMapping
];
