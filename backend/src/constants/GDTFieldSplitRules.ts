export const GDTFieldSplitRules: { [key: string]: string[] } = {
    '8400': ['dateOfBirth', 'gender'], // Split DOB and gender
    '8402': ['testGroup', 'testNumber'], // Split test group and number
    '3101': ['lastName'], // No split; directly assign lastName
    '3102': ['firstName'], // No split; directly assign firstName
    '3103': ['dateOfBirth'], // No split; directly assign DOB
};
