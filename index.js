const fs = require('fs');
const XLSX = require('xlsx');
const { flattenObject } = require('./utils/flattenObject');
const { GENERATION_FOLDER_NAME } = require('./constants');

const getJsonData = async (filePath) => {
  return JSON.parse(fs.readFileSync(filePath));
};

const xlsx2json = async ({ fileNames, config }) => {
  const workbook = XLSX.utils.book_new();
  const {
    keyTitle = 'Translation Key',
    targetLanguageTitle = 'Target language',
    otherLanguageTitles,
    width = 80,
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
        [keyTitle]: key,
        [targetLanguageTitle]: value,
        ...otherColumns,
      };
    });

    const otherLanguageTitlesLength = otherLanguageTitles?.length || 0;
    const columnWidths = new Array(2 + otherLanguageTitlesLength).fill({ wch: width });

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  }

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  fs.writeFileSync(__dirname + `/${GENERATION_FOLDER_NAME}/locales.xlsx`, buffer);
  console.log('File saved!');
};

const json2xlsx = ({ fileName, config }) => {
  const workbook = XLSX.readFile(`${__dirname}/${fileName}`);
  const { keyTitle, columnTitlesAndLocaleCodes } = config?.column || {};

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log('sheetName :: ', sheetName);
    console.log(jsonData);
    console.log('=========');
  }
};

/*xlsx2json({
  fileNames: ['locale-file-1', 'locale-file-2'],
  config: {
    column: {
      keyTitle: 'Key',
      width: 80,
      targetLanguageTitle: 'English Translation',
      otherLanguageTitles: ['Arabic Translation', 'Spanish Translation'],
    },
  },
});*/

json2xlsx({
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
