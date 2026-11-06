'use strict';
/**
 * Generates README.md from docs/readme.md and the folders in lib/: the template's `<!-- utils -->` marker becomes a
 * list of the utils, each linked to its code, tests and docs.
 *
 *   npm run generate-readme    writes README.md
 *   npm run check-readme       fails if README.md is not what would be written (npm test and CI run this)
 */
const fs = require('node:fs'),
  path = require('node:path'),
  root = path.join(__dirname, '..'),
  utils = fs.readdirSync(path.join(root, 'lib'), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort(),
  list = utils.map(name => `* **${name}** [(code|tests|docs)](https://github.com/clay/clayutils/tree/master/lib/${name})`).join('\n'),
  readme = fs.readFileSync(path.join(__dirname, 'readme.md'), 'utf8').replace('<!-- utils -->', () => list),
  target = path.join(root, 'README.md');

if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8') !== readme) {
    console.error('README.md is out of date: run `npm run generate-readme`');
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(target, readme);
  console.log('Generated README.md');
}
