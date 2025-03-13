export const RosettaOBXFieldMapping: Record<string, { description:string; HL7: string; GDT: string; XMLcarecon: string; KMEHR: string }> = {
    "705000": {
        description: "Observation Value",
        GDT: "6305",
        XMLcarecon: "",
        KMEHR: "/kmehrmessage/transaction/link",
        HL7: "705000"
    },
    "714001": {
        description: "Time",
        HL7: "714001",
        GDT: "8439",
        XMLcarecon: "",
        KMEHR: "/kmehrmessage/header/time",
    },
    "714002": {
        description: "Degree Of Precision",
        HL7: "714002",
        GDT: "",
        XMLcarecon: "",
        KMEHR: ""
    },
    "714003": {
        description: "Date",
        HL7: "714003",
        GDT: "8432",
        XMLcarecon: "",
        KMEHR: "/kmehrmessage/header/date",
    },
    "720001":{
        description: "PDF embeded",
        GDT: "6305",
        XMLcarecon: "",
        KMEHR: "/kmehrmessage/transaction/link",
        HL7: "720001"
    }
}

// export const RosettaOBXFieldMapping: Record<string, { HL7: string; GDT: string; XMLcarecon: string; KMEHR: string }> = {
//     "701000": {
//         HL7: "Set ID - OBX",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "702000": {
//         HL7: "Value Type",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "703000": {
//         HL7: "Observation Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "704000": {
//         HL7: "Observation Sub-ID",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "705000": {
//         HL7: "Observation Value",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "706000": {
//         HL7: "Units",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "707000": {
//         HL7: "References Range",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "70800": {
//         HL7: "Abnormal Flags",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "709000": {
//         HL7: "Probability",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "710000": {
//         HL7: "Nature of Abnormal Test",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "711000": {
//         HL7: "Observation Result Status",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "712000": {
//         HL7: "Effective Date of Reference Range",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "713000": {
//         HL7: "User Defined Access Checks",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "714000": {
//         HL7: "Date/Time of the Observation",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "715000": {
//         HL7: "Producer's ID",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "716000": {
//         HL7: "Responsible Observer",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "717000": {
//         HL7: "Observation Method",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "718000": {
//         HL7: "Equipment Instance Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "719000": {
//         HL7: "Date/Time of the Analysis",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     }
// }