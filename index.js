const fs = require('fs');
const XLSX = require('xlsx');
const { flattenObject } = require('./utils/flattenObject');
const { GENERATION_FOLDER_NAME } = require('./constants');

const getJsonData = async (filePath) => {
  return JSON.parse(fs.readFileSync(filePath));
};

const generateExcel = async ({ fileNames, config }) => {
  const workbook = XLSX.utils.book_new();
  const {
    keyTitle,
    targetLanguageTitle,
    otherLanguageTitles,
    width,
  } = config?.column || {};

  for (const fileName of fileNames) {
    const jsonData = await getJsonData(`${__dirname}/locales/${fileName}.json`);
    const flattenedObject = flattenObject(jsonData);
    const data = Object.entries(flattenedObject).map(([key, value]) => {
      const otherColumns = {};
      otherLanguageTitles?.forEach((title) => {
        otherColumns[title] = '';
      });

      return {
        [keyTitle || 'Translation Key']: key,
        [targetLanguageTitle || 'Target language']: value,
        ...otherColumns,
      };
    });

    const otherLanguageTitlesLength = otherLanguageTitles?.length || 0;
    const columnWidths = new Array(2 + otherLanguageTitlesLength).fill({ wch: width || 80 });

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  }

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  fs.writeFileSync(__dirname + `/${GENERATION_FOLDER_NAME}/locales.xlsx`, buffer);
  console.log('File saved!');
};

generateExcel({
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
