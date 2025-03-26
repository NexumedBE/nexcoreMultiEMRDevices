export const RosettaOBXFieldMapping: Record<string, { description:string; HL7: string; GDT: string; XMLcarecon: string; KMEHR: string }> = {
    "701001": {
        description: "Set ID - OBX",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "701001"
    },
    "702001": {
        description: "Value Type",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "702001"
    },
    "703001": {
        description: "Observation Identifier",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "703001"
    },
    "704001": {
        description: "Observation Sub-ID",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "704001"
    },
    "705001": {
        description: "Observation Value",
        GDT: "6305",
        XMLcarecon: "",
        KMEHR: "/kmehrmessage/transaction/link",
        HL7: "705001"
    },
    "706001": {
        description: "Units",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "706001"
    },
    "707001": {
        description: "References Range",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "707001"
    },
    "708001": {
        description: "Abnormal Flags",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "708001"
    },
    "709001": {
        description: "Probability",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "709001"
    },
    "710001": {
        description: "Nature of Abnormal Test",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "710001"
    },
    "711001": {
        description: "Observation Result Statust",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "711001"
    },
    "712001": {
        description: "Effective Date Of Reference Range",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "712001"
    },
    "713001": {
        description: "Nature of Abnormal Test",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
        HL7: "713001"
    },
    "714001": {
        description: "Date/Time of the Observation",
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
    "715001": {
        description: "Producer's ID Identifier",
        HL7: "715001",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
    },
    "716001": {
        description: "Responsible Observer",
        HL7: "716001",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
    },
    "717001": {
        description: "Observation Method",
        HL7: "717001",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
    },
    "718001": {
        description: "Equipment Instance Identifier",
        HL7: "718001",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
    },
    "719001": {
        description: "Date/Time Of The Analysis",
        HL7: "719001",
        GDT: "",
        XMLcarecon: "",
        KMEHR: "",
    },
    "720001":{
        description: "Observation Site PDF embeded",
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