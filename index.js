const fs = require('fs');
const XLSX = require('xlsx');
const { flattenObject } = require('./utils/flattenObject');
const { GENERATION_FOLDER_NAME } = require('./constants');

const getJsonData = async (filePath) => {
  return JSON.parse(fs.readFileSync(filePath));
};

const generateExcel = async ({ fileNames }) => {
  const workbook = XLSX.utils.book_new();

  for (const fileName of fileNames) {
    const jsonData = await getJsonData(`${__dirname}/locales/${fileName}.json`);
    const flattenedObject = flattenObject(jsonData);
    const data = Object.entries(flattenedObject).map(([key, value]) => ({
      'Translation Key': key,
      'English Translation': value,
      'Arabic Translation': '',
    }));

    const columnWidths = [
      { wch: 80 },
      { wch: 80 },
      { wch: 80 },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  }

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  fs.writeFileSync(__dirname + `/${GENERATION_FOLDER_NAME}/locales.xlsx`, buffer);
  console.log('File saved!');
};

generateExcel({
  fileNames: ['locale-file-1', 'locale-file-2'],
});
