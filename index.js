const fs = require('fs');
const XLSX = require('xlsx');
const { flattenObject } = require('./utils/flattenObject');
const { GENERATION_FOLDER_NAME } = require('./constants');

const getJsonData = async (filePath) => {
  return JSON.parse(fs.readFileSync(filePath));
};

const json2xlsx = async ({ fileNames, config }) => {
  const workbook = XLSX.utils.book_new();
  const {
    keyTitle = 'Translation Key',
    targetLanguageTitle = 'Target language',
    otherLanguageTitles,
    width = 80,
  } = config?.column || {};

  for (const fileName of fileNames) {
    const jsonData = await getJsonData(`${__dirname}/locales/en/${fileName}.json`);
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

const xlsx2json = ({ fileName, config }) => {
  const workbook = XLSX.readFile(`${__dirname}/${fileName}`);
  const { keyTitle, columnTitlesAndLocaleCodes } = config?.column || {};

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonSheet = XLSX.utils.sheet_to_json(worksheet);
    console.log('sheetName :: ', sheetName);
    console.log('jsonSheet :: ', jsonSheet);
    console.log('=========');
  }
};

module.exports = { xlsx2json, json2xlsx };
