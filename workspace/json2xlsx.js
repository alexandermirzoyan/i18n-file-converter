const path = require('path');
const { json2xlsx } = require('../index');

json2xlsx({
  localesFolderPath: path.resolve(__dirname, '../locales'),
  config: {
    column: { keyTitle: 'Key', width: 80 },
  },
});
