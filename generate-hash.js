const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'password123';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Hash for '${password}': ${hash}`);
}

generateHash();