import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();


const NEXUMED_IN_DIR = 'C:\\Nexumed\\nexumedIn';


if (!fs.existsSync(NEXUMED_IN_DIR)) {
    fs.mkdirSync(NEXUMED_IN_DIR, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, NEXUMED_IN_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });


router.post('/receive-file', upload.single('file'), (req: Request, res: Response): void => { 
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    console.log(`📂 File received: ${req.file.filename}`);
    res.json({ message: 'File received successfully', filename: req.file.filename });
});

// Handle Multer errors globally
router.use((err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof multer.MulterError) {
        console.error('❌ Multer error:', err);
        res.status(500).json({ error: err.message });
        return;
    }
    next(err);
});

export default router;

