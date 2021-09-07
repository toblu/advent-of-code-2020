require('dotenv').config();
const path = require('path');
const { AocClient } = require('advent-of-code-client');

const day = process.argv[2];

if (!day) throw new Error('You must specify which day to run');

const client = new AocClient({
  year: 2020,
  day: +day,
  token: process.env.AOC_SESSION
});

const { run } = require(path.resolve(process.cwd(), day));

(async () => {
  await run(client);
  process.exit();
})();
