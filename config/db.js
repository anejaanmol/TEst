const mongoose = require('mongoose');


mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

db.on('connected', () => {
  console.log('[+] Connection To The Database: Success [+]');
});

db.on('error', (err) => {
  console.error(`[+] Connection To The Database: Failed, ${err} [+]`);
});

db.on('disconnected', () => {
  console.log('[+] Connection To The Database: Disconnected, Bye! [+]');
});

module.exports = db;
