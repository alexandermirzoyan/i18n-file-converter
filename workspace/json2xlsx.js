const { json2xlsx } = require('../index');

json2xlsx({
  fileNames: ['locale-file-1', 'locale-file-2'],
  config: {
    column: {
      keyTitle: 'Key',
      width: 80,
      targetLanguageTitle: 'English Translation',
      otherLanguageTitles: ['Arabic Translation', 'Spanish Translation'],
    },
  },
});
