const path = require('path');
const { xlsx2json } = require('../index');
const { GENERATION_FOLDER_NAME } = require('../constants');

xlsx2json({
  inputPath: path.resolve(__dirname, `../${GENERATION_FOLDER_NAME}/locales.xlsx`),
  outputPath: path.resolve(__dirname, `../${GENERATION_FOLDER_NAME}/locales`),
});
