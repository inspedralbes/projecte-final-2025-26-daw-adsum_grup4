const { Client } = require('ssh2');
const conn = new Client();
const config = {
  host: '188.245.228.110',
  port: 22,
  username: 'root',
  password: 'A#d5umR0ot!2026Xq'
};

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('cd adsum-prod && docker compose -f docker-compose.prod.yml logs backend', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).connect(config);
