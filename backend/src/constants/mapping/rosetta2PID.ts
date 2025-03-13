export const RosettaPIDFieldMapping: Record<string, { description:string; HL7: string; GDT: string; XMLcarecon: string; KMEHR: string }> = {
    "205001": {
        description: "Family Name",
        GDT: "3101",
        XMLcarecon: "/Message/Document/Patient/Name/LastName",
        KMEHR: "/kmehrmessage/folder/patient/familyname",
        HL7: "205001"
    },
    "205002": {
        description: "Given Name",
        GDT: "3102",
        XMLcarecon: "/Message/Document/Patient/Name/FirstName",
        KMEHR: "/kmehrmessage/folder/patient/firstname",
        HL7: "205002"
    },
    "207000": {
        description: "Date/Time of Birth",
        GDT: "3103",
        XMLcarecon: "/Message/Document/Patient/DateOfBirth",
        KMEHR: "/kmehrmessage/folder/patient/birthdate/date",
        HL7: "207000"
    },
    "208000":{
        description: "Administrative Sex",
        GDT: " 3110",
        XMLcarecon: "",
        KMEHR: "/kmehrmessage/folder/patient/sex/cd",
        HL7: "208000"
    },
    "219001":{
        description: "SSN Number - Patient",
        GDT: "3105",
        XMLcarecon: "",
        KMEHR: "/kmehrmessage/folder/patient/id",
        HL7: "219001"
    }
};



// export const RosettaPIDFieldMapping: Record<string, { HL7: string; GDT: string; XMLcarecon: string; KMEHR: string }> = {
//     "200000": {
//         HL7: "Patient Identification",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "201000": {
//         HL7: "Set ID - PID",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202000": {
//         HL7: "Patient ID",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202001": {
//         HL7: "ID Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202002": {
//         HL7: "Check Digit",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202003": {
//         HL7: "Check Digit Scheme",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202004": {
//         HL7: "Assigning Authority",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202005": {
//         HL7: "Identifier Type Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202006": {
//         HL7: "Assigning Facility",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202007": {
//         HL7: "Effective Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202008": {
//         HL7: "Expiration Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202009": {
//         HL7: "Assigning Jurisdiction",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "202010": {
//         HL7: "Assigning Agency Or Department",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203000": {
//         HL7: "Patient Identifier List",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203001": {
//         HL7: "ID Number",
//         GDT: "3105",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203002": {
//         HL7: "Check Digit",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203003": {
//         HL7: "Check Digit Scheme",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203004": {
//         HL7: "Assigning Authority",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203004.1": {
//         HL7: "Namespace Id",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203004.2": {
//         HL7: "Universal Id",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203004.3": {
//         HL7: "Universal Id Type",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203005": {
//         HL7: "Identifier Type Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203006": {
//         HL7: "Assigning Facility",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203007": {
//         HL7: "Effective Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203008": {
//         HL7: "Expiration Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203009": {
//         HL7: "Assigning Jurisdiction",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "203010": {
//         HL7: "Assigning Agency Or Department",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "204000": {
//         HL7: "Alternate Patient ID - PID",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205000": {
//         HL7: "Patient Name",
//         GDT: "3102",
//         XMLcarecon: "/Message/Document/Patient/Name/FirstName",
//         KMEHR: "/kmehrmessage/header/folder/patient/firstname"
//     },
//     "205001": {
//         HL7: "Family Name",
//         GDT: "3101",
//         XMLcarecon: "/Message/Document/Patient/Name/LastName",
//         KMEHR: "/kmehrmessage/header/folder/patient/familyname"
//     },
//     "205002": {
//         HL7: "Given Name",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205003": {
//         HL7: "Second And Further Given Names Or Initials Thereof",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205004": {
//         HL7: "Suffix",
//         GDT: "3100",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205005": {
//         HL7: "Prefix",
//         GDT: "3100",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205006": {
//         HL7: "Degree",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205007": {
//         HL7: "Name Type Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205008": {
//         HL7: "Name Representation Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205009": {
//         HL7: "Name Context",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205010": {
//         HL7: "Name Validity Range",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205011": {
//         HL7: "Name Assembly Order",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205012": {
//         HL7: "Effective Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205013": {
//         HL7: "Expiration Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "205014": {
//         HL7: "Professional Suffix",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206000": {
//         HL7: "Mother's Maiden Name",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206001": {
//         HL7: "Family Name",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206002": {
//         HL7: "Given Name",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206003": {
//         HL7: "Second And Further Given Names Or Initials Thereof",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206004": {
//         HL7: "Suffix",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206005": {
//         HL7: "Prefix",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206006": {
//         HL7: "Degree",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206007": {
//         HL7: "Name Type Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206008": {
//         HL7: "Name Representation Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206009": {
//         HL7: "Name Context",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206010": {
//         HL7: "Name Validity Range",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206011": {
//         HL7: "Name Assembly Order",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206012": {
//         HL7: "Effective Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206013": {
//         HL7: "Expiration Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "206014": {
//         HL7: "Professional Suffix",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "207000": {
//         HL7: "Date/Time of Birth",
//         GDT: "3103",
//         XMLcarecon: "/Message/Document/Patient/DateOfBirth",
//         KMEHR: "/kmehrmessage/folder/patient/birthdate/date"
//     },
//     "208000": {
//         HL7: "Administrative Sex",
//         GDT: "3110",
//         XMLcarecon: "/Message/Document/Patient/Sex",
//         KMEHR: "/kmehrmessage/folder/patient/sex/cd"
//     },
//     "209000": {
//         HL7: "Patient Alias",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209001": {
//         HL7: "Family Name",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209002": {
//         HL7: "Given Name",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209003": {
//         HL7: "Second And Further Given Names Or Initials Thereof",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209004": {
//         HL7: "Suffix",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209005": {
//         HL7: "Prefix",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209006": {
//         HL7: "Degree",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209007": {
//         HL7: "Name Type Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209008": {
//         HL7: "Name Representation Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209009": {
//         HL7: "Name Context",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209010": {
//         HL7: "Name Validity Range",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209011": {
//         HL7: "Name Assembly Order",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209012": {
//         HL7: "Effective Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209013": {
//         HL7: "Expiration Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "209014": {
//         HL7: "Professional Suffix",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "210000": {
//         HL7: "Race",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "210001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "210002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "210003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "210004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "210005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "210006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211000": {
//         HL7: "Patient Address",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211001": {
//         HL7: "Street Address",
//         GDT: "3107",
//         XMLcarecon: "/Message/Document/Patient/Address/Street",
//         KMEHR: "/kmehrmessage/folder/patient/address/street"
//     },
//     "211002": {
//         HL7: "Other Designation",
//         GDT: "",
//         XMLcarecon: "/Message/Document/Patient/Address/Number",
//         KMEHR: "/kmehrmessage/folder/patient/address/housenumber"
//     },
//     "211003": {
//         HL7: "City",
//         GDT: "3106",
//         XMLcarecon: "/Message/Document/Patient/Address/City",
//         KMEHR: "/kmehrmessage/folder/patient/address/city"
//     },
//     "211004": {
//         HL7: "State Or Province",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211005": {
//         HL7: "Zip Or Postal Code",
//         GDT: "",
//         XMLcarecon: "/Message/Document/Patient/Address/Zipcode",
//         KMEHR: "/kmehrmessage/folder/patient/address/zip"
//     },
//     "211006": {
//         HL7: "Country",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: "/kmehrmessage/folder/patient/address/country/cd"
//     },
//     "211007": {
//         HL7: "Address Type",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211008": {
//         HL7: "Other Geographic Designation",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211009": {
//         HL7: "County/Parish Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211010": {
//         HL7: "Census Tract",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211011": {
//         HL7: "Address Representation Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211012": {
//         HL7: "Address Validity Range",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211013": {
//         HL7: "Effective Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "211014": {
//         HL7: "Expiration Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "212000": {
//         HL7: "County Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213000": {
//         HL7: "Phone Number - Home",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213001": {
//         HL7: "Telephone Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213002": {
//         HL7: "Telecommunication Use Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213003": {
//         HL7: "Telecommunication Equipment Type",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213004": {
//         HL7: "Email Address",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213005": {
//         HL7: "Country Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213006": {
//         HL7: "Area/City Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213007": {
//         HL7: "Local Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213008": {
//         HL7: "Extension",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213009": {
//         HL7: "Any Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213010": {
//         HL7: "Extension Prefix",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213011": {
//         HL7: "Speed Dial Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "213012": {
//         HL7: "Unformatted Telephone Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214000": {
//         HL7: "Phone Number - Business",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214001": {
//         HL7: "Telephone Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214002": {
//         HL7: "Telecommunication Use Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214003": {
//         HL7: "Telecommunication Equipment Type",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214004": {
//         HL7: "Email Address",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214005": {
//         HL7: "Country Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214006": {
//         HL7: "Area/City Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214007": {
//         HL7: "Local Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214008": {
//         HL7: "Extension",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214009": {
//         HL7: "Any Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214010": {
//         HL7: "Extension Prefix",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214011": {
//         HL7: "Speed Dial Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "214012": {
//         HL7: "Unformatted Telephone Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "215000": {
//         HL7: "Primary Language",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "215001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "215002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "215003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "215004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "215005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "215006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "216000": {
//         HL7: "Marital Status",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "216001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "216002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "216003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "216004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "216005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "216006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "217000": {
//         HL7: "Religion",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "217001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "217002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "217003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "217004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "217005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "217006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218000": {
//         HL7: "Patient Account Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218001": {
//         HL7: "Id Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218002": {
//         HL7: "Check Digit",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218003": {
//         HL7: "Check Digit Scheme",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218004": {
//         HL7: "Assigning Authority",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218005": {
//         HL7: "Identifier Type Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218006": {
//         HL7: "Assigning Facility",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218007": {
//         HL7: "Effective Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218008": {
//         HL7: "Expiration Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218009": {
//         HL7: "Assigning Jurisdiction",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "218010": {
//         HL7: "Assigning Agency Or Department",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "219000": {
//         HL7: "SSN Number - Patient",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "220000": {
//         HL7: "Driver's License Number - Patient",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "220001": {
//         HL7: "License Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "220002": {
//         HL7: "Issuing State, Province, Country",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "220003": {
//         HL7: "Expiration Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221000": {
//         HL7: "Mother's Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221001": {
//         HL7: "Id Number",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221002": {
//         HL7: "Check Digit",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221003": {
//         HL7: "Check Digit Scheme",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221004": {
//         HL7: "Assigning Authority",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221005": {
//         HL7: "Identifier Type Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221006": {
//         HL7: "Assigning Facility",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221007": {
//         HL7: "Effective Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221008": {
//         HL7: "Expiration Date",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221009": {
//         HL7: "Assigning Jurisdiction",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "221010": {
//         HL7: "Assigning Agency Or Department",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "222000": {
//         HL7: "Ethnic Group",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "222001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "222002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "222003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "222004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "222005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "222006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "223000": {
//         HL7: "Birth Place",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "224000": {
//         HL7: "Multiple Birth Indicator",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "225000": {
//         HL7: "Birth Order",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "226000": {
//         HL7: "Citizenship",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "226001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "226002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "226003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "226004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "226005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "226006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "227000": {
//         HL7: "Veterans Military Status",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "227001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "227002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "227003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "227004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "227005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "227006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "228000": {
//         HL7: "Nationality",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "228001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "228002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "228003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "228004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "228005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "228006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "229000": {
//         HL7: "Patient Death Date and Time",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "229001": {
//         HL7: "Time",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "229002": {
//         HL7: "Degree Of Precision",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "230000": {
//         HL7: "Patient Death Indicator",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "231000": {
//         HL7: "Identity Unknown Indicator",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "232000": {
//         HL7: "Identity Reliability Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "233000": {
//         HL7: "Last Update Date/Time",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "233001": {
//         HL7: "Time",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "233002": {
//         HL7: "Degree Of Precision",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "234000": {
//         HL7: "Last Update Facility",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "234001": {
//         HL7: "Namespace Id",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "234002": {
//         HL7: "Universal Id",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "234003": {
//         HL7: "Universal Id Type",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "235000": {
//         HL7: "Species Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "235001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "235002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "235003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "235004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "235005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "235006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "236000": {
//         HL7: "Breed Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "236001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "236002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "236003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "236004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "236005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "236006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "237000": {
//         HL7: "Strain",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "238000": {
//         HL7: "Production Class Code",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "238001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "238002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "238003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "238004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "238005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "238006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239000": {
//         HL7: "Tribal Citizenship",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239001": {
//         HL7: "Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239002": {
//         HL7: "Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239003": {
//         HL7: "Name Of Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239004": {
//         HL7: "Alternate Identifier",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239005": {
//         HL7: "Alternate Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239006": {
//         HL7: "Name Of Alternate Coding System",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239007": {
//         HL7: "Coding System Version Id",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239008": {
//         HL7: "Alternate Coding System Version Id",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     },
//     "239009": {
//         HL7: "Original Text",
//         GDT: "",
//         XMLcarecon: "",
//         KMEHR: ""
//     }
// }
