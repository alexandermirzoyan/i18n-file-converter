const fs = require('fs');
const fsp = require('fs/promises');
const XLSX = require('xlsx');

const { flattenObject } = require('./utils/flattenObject');
const { deepenObject } = require('./utils/deepenObject');

const getJsonData = async (filePath) => {
  return JSON.parse(fs.readFileSync(filePath));
};

const json2xlsx = async ({ inputPath, outputPath, config }) => {
  const localeSubFolders = fs.readdirSync(inputPath);

  if (!localeSubFolders.length) {
    throw Error('No locales found');
  }

  const defaultLocale = localeSubFolders[0];
  const restLocales = localeSubFolders.filter((folder) => folder !== defaultLocale);
  const defaultLocaleFiles = fs.readdirSync(`${inputPath}/${defaultLocale}`);
  const { width = 80 } = config?.column || {};
  const workbook = XLSX.utils.book_new();
  const keyTitle = 'Key';

  for (const file of defaultLocaleFiles) {
    const jsonData = await getJsonData(`${inputPath}/${defaultLocale}/${file}`);
    const flattenedObject = flattenObject(jsonData);
    const data = Object.entries(flattenedObject).map(([key, value]) => ({ [keyTitle]: key, [defaultLocale]: value }));

    for (const otherLocale of restLocales) {
      const jsonData = await getJsonData(`${inputPath}/${otherLocale}/${file}`);
      const flattenedObject = flattenObject(jsonData);
      Object.entries(flattenedObject).forEach(([key, value]) => {
        const foundIndex = data.findIndex((item) => item[keyTitle] === key);
        data[foundIndex][otherLocale] = value;
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = new Array(data.length).fill({ wch: width });
    XLSX.utils.book_append_sheet(workbook, worksheet, file);
  }

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  if (!fs.existsSync(outputPath)) {
    await fsp.mkdir(outputPath, { recursive: true });
  }

  await fsp.writeFile(`${outputPath}/locales.xlsx`, buffer);

  console.log('File saved!');
};

const xlsx2json = async ({ inputPath, outputPath }) => {
  const workbook = XLSX.readFile(inputPath);
  const keyTitle = 'Key';

  for (const sheetName of workbook.SheetNames) {
    const locales = {};
    const worksheet = workbook.Sheets[sheetName];
    const jsonSheet = XLSX.utils.sheet_to_json(worksheet);

    jsonSheet.forEach((row) => {
      const key = row[keyTitle];
      delete row[keyTitle];
      Object.entries(row).map(([locale, value]) => {
        if (!locales[locale]) {
          locales[locale] = {};
        }

        locales[locale][key] = value;
      });
    });

    for (const locale in locales) {
      const dirPath = `${outputPath}/${locale}`;
      const deepenedObject = deepenObject(locales[locale]);
      const buffer = Buffer.from(JSON.stringify(deepenedObject, null, 2));

      if (!fs.existsSync(dirPath)) {
        await fsp.mkdir(dirPath, { recursive: true });
      }

      await fsp.writeFile(`${outputPath}/${locale}/${sheetName}`, buffer);
    }
  }
  
  console.log('Files saved!');
};

module.exports = { xlsx2json, json2xlsx };
