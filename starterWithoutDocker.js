const { exec } = require('child_process');
const path = require('path');

const directories = [
  "pocketbase",
  "door-service",
  "weather-service-master",
  "window-service",
  "backend/todo-server",
  "frontend/todo-app",
];

// docker build -t pocketbase . comando per creare immagine
function startInDirectory(directory) {
  let command;
  if(directory === 'pocketbase') command = 'docker run  -p 8085:8085 pocketbase';
  else if (directory === 'frontend/todo-app') command = 'http-server . -c-1'
  else command = 'npm run start';
  const options = { cwd: path.join(__dirname, directory) };

  const childProcess = exec(command, options);
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
}

for (const dir of directories) {
  startInDirectory(dir);
}