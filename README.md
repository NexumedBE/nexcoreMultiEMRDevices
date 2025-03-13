NexumedApp
A desktop application built using Electron, React, and Node.js that listens for files dropped into a specific folder (nexumedIn), processes them, and outputs results to another folder (nexumedOut).

************************if running in DEV  in in App.tsx comment out import UpdateNotification from "./components/UpdateNotification";  and < UpdateNotification /> as this will block the dev envi as this needs to be abel to read the version in the window of the electron application.

<!-- Project Structure start up inital Dec 10, 2024

Prerequisites
Node.js (v16 or higher)

Download and install from Node.js Official Website.
Git (to clone and manage the repository)

Install Git from Git Official Website.
Initial Setup
Clone the repository:

bash
Copy code
git clone https://github.com/NexumedBE/nexumedApp.git
cd nexumedApp
Install root-level dependencies (e.g., concurrently):


npm install
Subdirectory Setup
1. Backend
Install dependencies:

cd backend
npm install
Run in development mode:

npm run dev
The backend runs on http://localhost:2756 by default.



2. Frontend
Install dependencies:

cd ../frontend
npm install
Run in development mode:

npm run dev
The frontend runs on http://localhost:5173 by default.

Build for production:

npm run build



3. Electron
Install dependencies:

cd ../electron
npm install
Run in development mode:


npm run start
Compile TypeScript: Before running in production, compile the Electron files:

npx tsc
Running the Entire Application
The root package.json provides a script to run all three parts (backend, frontend, and Electron) concurrently:

Start everything:

npm run dev
This script runs:

The backend on http://localhost:2756
The frontend on http://localhost:5173
The Electron app.
Key Features
Electron Desktop Integration:

Desktop application built with Electron.
Listens for files in nexumedIn (on the desktop) and processes them.
File Monitoring:

Backend continuously monitors the nexumedIn folder using the chokidar package.
Frontend:

A React-based user interface to interact with the application.
Folder Structure Details
Backend (backend/)
Uses Node.js and Express for API logic.
Contains listener.ts to watch for files in nexumedIn.
Frontend (frontend/)
Built with React and Vite for a fast development environment.
React components are in the components/ folder.
Electron (electron/)
The main.ts file creates the Electron window and handles communication between backend and frontend.
preload.ts ensures secure IPC communication.
Notes for Future Developers
Additions:
If adding new features, document changes in the README.
Debugging:
Use logs in both backend/src/listener.ts and electron/main.ts to track errors.
Ensure Security:
Update preload.ts whenever adding new IPC events to ensure safe communication.


Also see Dev Docs for more ongoing info. -->