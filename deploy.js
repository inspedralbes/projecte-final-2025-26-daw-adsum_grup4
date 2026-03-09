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
  'DEBIAN_FRONTEND=noninteractive apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker.io docker-compose docker-compose-v2 -y || true',
  'apt-get autoremove -y',
  'apt-get install -y ca-certificates curl gnupg lsb-release',
  'mkdir -m 0755 -p /etc/apt/keyrings',
  'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes',
  'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null',
  'apt-get update',
  'DEBIAN_FRONTEND=noninteractive apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin git',
  'if [ ! -d "adsum-prod" ]; then git clone -b dev https://github.com/inspedralbes/projecte-final-2025-26-daw-adsum_grup4.git adsum-prod; else cd adsum-prod && git fetch origin && git reset --hard origin/dev; fi',
  'cd adsum-prod && cp -n .env.example .env || true',
  'systemctl enable docker && systemctl restart docker || true',
  'cd adsum-prod && docker compose -f docker-compose.prod.yml down || true',
  'cd adsum-prod && docker compose -f docker-compose.prod.yml up -d --build',
  'docker ps'
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
