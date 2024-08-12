const { xlsx2json } = require('../index');

xlsx2json({
  fileName: '__generated/locales.xlsx',
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
