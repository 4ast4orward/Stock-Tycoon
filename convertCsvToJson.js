const csv = require('csvtojson');
const fs = require('fs');

// List your CSV files here
const csvFiles = [
  "C:\\Users\\trypz\\Desktop\\Budget efficiency\\sp500_companies.csv",
  "C:\\Users\\trypz\\Desktop\\Budget efficiency\\sp500_index.csv",
  "C:\\Users\\trypz\\Desktop\\Budget efficiency\\sp500_stocks.csv"
];

const jsonFilePath = "C:\\Users\\trypz\\Desktop\\Budget efficiency\\sp500_data.json"; // Path for the output JSON file

const convertCsvFilesToJson = async () => {
  try {
    let allData = [];
    for (const file of csvFiles) {
      const jsonArray = await csv().fromFile(file);
      allData = allData.concat(jsonArray);
    }
    fs.writeFileSync(jsonFilePath, JSON.stringify(allData, null, 2), 'utf-8');
    console.log('CSV files successfully converted to JSON!');
  } catch (error) {
    console.error('Error converting CSV to JSON:', error);
  }
};

convertCsvFilesToJson();