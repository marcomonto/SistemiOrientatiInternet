const {exec} = require('child_process');
const path = require('path');

let command = '' +
  'docker run -p 9001:9001' +
  ' --network app-network' +
  '  --ip 10.88.0.89  -e IFACE=10.88.0.89 -e PORT=9001 ' +
  'window';


const childProcess = exec(command);
childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);