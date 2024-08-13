const path = require('path');
const { json2xlsx } = require('../index');
const { GENERATION_FOLDER_NAME } = require('../constants');

json2xlsx({
  inputPath: path.resolve(__dirname, '../locales'),
  outputPath: path.resolve(__dirname, `../${GENERATION_FOLDER_NAME}`),
  config: {
    column: { keyTitle: 'Key', width: 80 },
  },
});
