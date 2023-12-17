const {exec} = require('child_process');
const path = require('path');

const directories = [
  "pocketbase",
  "door-service",
  "weather-service-master",
  "window-service",
  "heatPump-service",
  "thermometer-service",
  "actuator-service",
  "backend/server",
  "frontend/app",
];

(async function () {
  for (const dir of directories)
    if(dir != 'pocketbase')
      setTimeout(() => startInDirectory(dir), 2000);
  else startInDirectory(dir)
})();


// docker build -t pocketbase . comando per creare immagine
// START NEW WINDOW SERVICE docker run -p 8101:8101 --name new-window --network app-network --ip 10.88.0.200 -e IFACE=10.88.0.200 -e PORT=8101 -e=ERROR_PROB=0 window
// CREATE NEW WINDOW SERVICE docker build -t window .
// START NEW DOOR SERVICE docker run -p 8102:8102 --name new-door --network app-network --ip 10.88.0.201 -e IFACE=10.88.0.201 -e PORT=8102 -e=ERROR_PROB=0 door
// CREATE NEW DOOR SERVICE docker build -t door .
function startInDirectory(directory) {
  let command;
  if (directory === 'pocketbase') command = 'docker run  -p 8085:8085 pocketbase';
  else if (directory === 'frontend/app') command = 'http-server . -c-1'
  else command = 'npm run start';
  const options = {cwd: path.join(__dirname, directory)};

  const childProcess = exec(command, options);
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
}