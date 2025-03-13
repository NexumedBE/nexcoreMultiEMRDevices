echo Building frontend...
cd frontend
npm run build:obfuscate
cd ..

echo Building backend...
cd backend
npm run build:obfuscate
cd ..

echo Building Electron app...
cd electron
npm run build:obfuscate
cd ..

echo All builds completed!
pause
