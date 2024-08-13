const path = require('path');
const { xlsx2json } = require('../index');
const { GENERATION_FOLDER_NAME } = require('../constants');

xlsx2json({
  inputPath: path.resolve(__dirname, `../${GENERATION_FOLDER_NAME}/locales.xlsx`),
  config: {
    column: {
      keyTitle: 'Key',
      columnTitlesAndLocaleCodes: {
        'English Translation': 'en',
        'Arabic Translation': 'ar',
        'Spanish Translation': 'es',
      },
    },
  },
});
