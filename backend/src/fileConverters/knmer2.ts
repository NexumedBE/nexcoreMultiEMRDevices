import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { allMappings } from '../constants/mapping';
import pdfParse from 'pdf-parse';

async function extractTextFromPDF(pdfFilePath: string): Promise<string | null> {
    try {
        const dataBuffer = fs.readFileSync(pdfFilePath);
        const data = await pdfParse(dataBuffer);
        return data.text; // Extracted text
    } catch (err) {
        console.error(`Error extracting text from PDF: ${pdfFilePath}`, err);
        return null;
    }
}

// Directories for templates and data
const templatesDir = path.join(__dirname, '..', 'templates', 'careConnect');
const parsedDataFolder = path.join(
    'C:\\Nexumed',
    'inFromDevice',
    'parsedgdt-inFromDevice'
);
const outputFolder = path.join(
    'C:\\Nexumed',
    'inFromDevice',
    'output-to-emr'
);
const base64Folder = path.join(
    'C:\\Nexumed',
    'inFromDevice',
    'base64'
);
const inFromDeviceFolder = 'C:\\Nexumed\\inFromDevice';

// Ensure the necessary folders exist
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
    console.log(`Created output folder: ${outputFolder}`);
}
if (!fs.existsSync(base64Folder)) {
    fs.mkdirSync(base64Folder, { recursive: true });
    console.log(`Created base64 folder: ${base64Folder}`);
}

// Register Handlebars partials
function registerPartials() {
    console.log(`Registering Handlebars partials from: ${templatesDir}`);
    if (!fs.existsSync(templatesDir)) {
        console.warn(`Templates directory does not exist: ${templatesDir}`);
        return;
    }
    const files = fs.readdirSync(templatesDir);
    files.forEach((file) => {
        if (file.endsWith('.hbs')) {
            const partialName = path.basename(file, '.hbs');
            const partialContent = fs.readFileSync(path.join(templatesDir, file), 'utf8');
            Handlebars.registerPartial(partialName, partialContent);
            console.log(`Registered partial: ${partialName}`);
        }
    });
}

// Map GDT JSON data to KMEHR XML structure
async function mapGDTToKMEHR(jsonData: Record<string, string>): Promise<Record<string, any>> {
    const mappedData: Record<string, any> = {};
    console.log("[KMEHRGenerators] Starting mapping of GDT JSON to KMEHR structure...");

    for (const mapping of allMappings) {
        for (const [fieldKey, mappingDetails] of Object.entries(mapping)) {
            const gdtField = mappingDetails.GDT.trim();
            const kmehrPath = mappingDetails.KMEHR;

            if (gdtField && kmehrPath) {
                let value = jsonData[gdtField];

                // Handle gender field conversion
                if (gdtField === "3110") {
                    value = value === "1" ? "male" : value === "2" ? "female" : "unknown";
                }

                // Handle PDFs (GDT field 6305 or links)
                if (gdtField === "6305" || kmehrPath.endsWith("/link")) {
                    const filePath = value;
                    if (fs.existsSync(filePath)) {
                        const base64Encoded = encodeFileToBase64(filePath);
                        if (base64Encoded) {
                            value = base64Encoded;
                            mappedData["lnk_type"] = "multimedia";
                            mappedData["lnk_mediatype"] = "application/pdf";
                            
                            // ✅ Embed Base64 PDF in mappedData correctly
                            const pathParts = kmehrPath.split('/').filter(Boolean);
                            let currentLevel = mappedData;
                            for (let i = 0; i < pathParts.length - 1; i++) {
                                const part = pathParts[i];
                                if (!currentLevel[part]) {
                                    currentLevel[part] = {};
                                }
                                currentLevel = currentLevel[part];
                            }
                            currentLevel[pathParts[pathParts.length - 1]] = base64Encoded; // Store PDF data
                
                            // Save Base64-decoded PDF
                            const pdfFileName = `${path.basename(filePath, path.extname(filePath))}.pdf`;
                            const pdfFilePath = path.join(base64Folder, pdfFileName);
                            fs.writeFileSync(pdfFilePath, Buffer.from(base64Encoded, 'base64'));
                            console.log(`[PDF] Decoded PDF file saved to: ${pdfFilePath}`);
                
                            // ✅ Extract text but don't block execution
                            extractTextFromPDF(pdfFilePath)
                                .then((extractedText) => {
                                    if (extractedText) {
                                        console.log("[PDF] Extracted text:", extractedText); // ✅ Log only, don't store
                                    }
                                })
                                .catch((err) => {
                                    console.error("[PDF] Error extracting text:", err);
                                });
                        }
                    }
                }

                if (value) {
                    const pathParts = kmehrPath.split('/').filter(Boolean);
                    let currentLevel = mappedData;
                    for (let i = 0; i < pathParts.length - 1; i++) {
                        const part = pathParts[i];
                        if (!currentLevel[part]) {
                            currentLevel[part] = {};
                        }
                        currentLevel = currentLevel[part];
                    }
                    currentLevel[pathParts[pathParts.length - 1]] = value;
                } else {
                    console.warn(`[KMEHRGenerators] Missing value for GDT Field ${gdtField}`);
                }
            }
        }
    }

    // console.log("[KMEHRGenerators] Final Mapped Data:", JSON.stringify(mappedData, null, 2));
    return mappedData;
}



// Base64 encode a file
function encodeFileToBase64(filePath: string): string | null {
    try {
        const fileData = fs.readFileSync(filePath);
        return fileData.toString('base64');
    } catch (err) {
        console.error(`Error encoding file to Base64: ${filePath}`, err);
        return null;
    }
}

// Populate the KMEHR XML template
function populateKMEHRTemplate(data: Record<string, any>, outputFilename: string) {
    const mainTemplatePath = path.join(templatesDir, 'kmehrmessageTemplate.hbs');
    if (!fs.existsSync(mainTemplatePath)) {
        console.error(`[KMEHRGenerators] Main template not found: ${mainTemplatePath}`);
        return;
    }

    const mainTemplateContent = fs.readFileSync(mainTemplatePath, 'utf8');
    const mainTemplate = Handlebars.compile(mainTemplateContent);

    const populatedXML = mainTemplate(data);

    const outputPath = path.join(outputFolder, outputFilename);
    fs.writeFileSync(outputPath, populatedXML);
    console.log(`[KMEHRGenerators] KMEHR XML generated at: ${outputPath}`);
}

// Process a single GDT JSON file
function processFile(filePath: string) {
    console.log(`[KMEHRGenerators] Processing file: ${filePath}`);
    try {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const mappedData = mapGDTToKMEHR(jsonData);
        const outputFilename = path.basename(filePath).replace('.json', '.xml');
        populateKMEHRTemplate(mappedData, outputFilename);
    } catch (err) {
        console.error(`[KMEHRGenerators] Error processing file: ${filePath}`, err);
    }
}

// Clean up files in a folder
function cleanUpFolder(folderPath: string, preserveFiles: string[] = []) {
    console.log(`[cleanUpFolder] Cleaning files and subfolders in: ${folderPath}`);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`[cleanUpFolder] Error reading folder: ${folderPath}`, err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(folderPath, file);

            // Skip preserved files
            if (preserveFiles.includes(file)) {
                console.log(`[cleanUpFolder] Preserving file: ${file}`);
                return;
            }

            fs.stat(filePath, (statErr, stats) => {
                if (statErr) {
                    console.error(`[cleanUpFolder] Error accessing ${filePath}: ${statErr.message}`);
                    return;
                }

                if (stats.isFile()) {
                    // Delete individual files
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error(`[cleanUpFolder] Error deleting file ${filePath}: ${unlinkErr.message}`);
                        } else {
                            console.log(`[cleanUpFolder] Deleted file: ${filePath}`);
                        }
                    });
                } else if (stats.isDirectory()) {
                    // Recursively delete subfolders
                    fs.rm(filePath, { recursive: true, force: true }, (rmErr) => {
                        if (rmErr) {
                            console.error(`[cleanUpFolder] Error deleting subfolder ${filePath}: ${rmErr.message}`);
                        } else {
                            console.log(`[cleanUpFolder] Deleted subfolder: ${filePath}`);
                        }
                    });
                }
            });
        });
    });
}

// Watch folder for new files
function watchFolder() {
    console.log(`Initialized watcher on folder: ${parsedDataFolder}`);

    const watcher = chokidar.watch(parsedDataFolder, {
        persistent: true,
        ignored: [
            /(^|[\/\\])\../, // Ignore hidden files
            `${outputFolder}/**`, // Ignore files in output folder
        ],
        depth: 1,
    });

    watcher
        .on('add', (filePath) => {
            console.log(`[KMEHRGenerators] New file detected: ${filePath}`);
            if (filePath.endsWith('.json')) {
                processFile(filePath);
            }
        })
        .on('error', (error) => {
            console.error(`[KMEHRGenerators] Watcher error: ${error}`);
        });
}

// Watch the `output-to-emr` folder for file processing completion
function watchForThirdPartyProcessing() {
    console.log(`[watchForThirdPartyProcessing] Monitoring folder: ${outputFolder}`);

    const thirdPartyOutputFolder = 'C:\\MESI services\\MESI mTABLET GDT Integration Service\\Output';
    const preservedListenerFile = 'mTABLET.IntegrationService.GDT.WaitForResult.exe'; // File to preserve

    const watcher = chokidar.watch(outputFolder, {
        persistent: true,
        depth: 0, 
    });

    watcher
        .on('unlink', (filePath) => {
            console.log(`[watchForThirdPartyProcessing] File processed and removed: ${filePath}`);

            // Wait a bit to ensure all operations are complete before cleanup
            setTimeout(() => {
                console.log(`[watchForThirdPartyProcessing] Starting cleanup process...`);

                // Clean subfolders and files in `parsedgdt-inFromDevice`, `output-to-emr`, and `base64`
                cleanUpFolder(parsedDataFolder);
                cleanUpFolder(outputFolder);
                cleanUpFolder(base64Folder); 

                // Clean files directly in the root `inFromDevice` folder
                cleanUpFolder(inFromDeviceFolder, ['parsedgdt-inFromDevice', 'output-to-emr', 'base64']);

                // Clean files in the `Output` folder while preserving the listener
                cleanUpFolder(thirdPartyOutputFolder, [preservedListenerFile]);

            }, 5000); 
        })
        .on('error', (error) => {
            console.error(`[watchForThirdPartyProcessing] Error watching folder: ${error}`);
        });
}

export function generateKMEHR(parsedJson: any) {
    registerPartials(); 
    const mappedData = mapGDTToKMEHR(parsedJson);
    const outputFilename = `kmehr_output_${Date.now()}.xml`;
    populateKMEHRTemplate(mappedData, outputFilename);

    watchFolder();
    watchForThirdPartyProcessing();

    if (outputFolder) {
        console.log(`[KMEHRGenerators] Using provided output folder: ${outputFolder}`);
    }
}

