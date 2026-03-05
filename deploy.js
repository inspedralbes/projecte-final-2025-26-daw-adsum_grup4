const { Client } = require('ssh2');

const conn = new Client();

const config = {
  host: '188.245.228.110',
  port: 22,
  username: 'root',
  password: 'A#d5umR0ot!2026Xq',
  tryKeyboard: true
};

const commands = [
  'apt-get update',
  'DEBIAN_FRONTEND=noninteractive dpkg --configure -a',
  'DEBIAN_FRONTEND=noninteractive apt-get install --fix-broken -y',
  'DEBIAN_FRONTEND=noninteractive apt-get remove docker docker-engine docker.io containerd runc docker-ce docker-ce-cli containerd.io -y || true',
  'DEBIAN_FRONTEND=noninteractive apt-get install docker.io docker-compose-v2 git -y',
  'if [ ! -d "adsum-prod" ]; then git clone https://github.com/inspedralbes/projecte-final-2025-26-daw-adsum_grup4.git adsum-prod; else cd adsum-prod && git pull origin main; fi',
  'cd adsum-prod && cp -n .env.example .env || true',
  'cd adsum-prod && systemctl enable docker && systemctl start docker || true',
  'cd adsum-prod && rm -f deploy.js', // Clean up potentially uploaded deploy.js
  'cd adsum-prod && docker compose -f docker-compose.prod.yml down || true',
  'cd adsum-prod && docker compose -f docker-compose.prod.yml up -d --build'
];

conn.on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
  finish([config.password]);
});

conn.on('ready', () => {
  console.log('Client :: ready');
  let currentCmdIndex = 0;

  const executeNext = () => {
    if (currentCmdIndex >= commands.length) {
      console.log('All commands executed ok.');
      conn.end();
      return;
    }
    const cmd = commands[currentCmdIndex++];
    console.log(`Executing: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
        console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
        executeNext();
      }).on('data', (data) => {
        process.stdout.write(data);
      }).stderr.on('data', (data) => {
        process.stderr.write(data);
      });
    });
  };

  executeNext();
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect(config);
