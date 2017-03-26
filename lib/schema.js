const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const directory = path.normalize(`${__dirname}/../schemas/`);

const raw_schemas = fs.readdirSync(directory);

let schemas = {};

for (let schema of raw_schemas) {
  if (!schema.endsWith('.yaml')) {
    continue;
  }

  let schema_path = path.normalize(`${directory}/${schema}`);
  let name = path.parse(schema).name;

  console.log(`Registering Schema: ${name}`);

  schemas[name] = yaml.safeLoad(fs.readFileSync(schema_path).toString());
}

function validate(type, object) {
  console.log('validate');
  let schema = schemas[type];

  if (!schema) {
    return true;
  }

  // TODO

  return true;
}

module.exports = {
  schemas,
  validate
};

