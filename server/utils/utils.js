
import fs from 'fs';
import csvParser from 'csv-parser';

const parseCsv = () => {
  // const file = "./datasets/sample.csv";
  const file = "./datasets/import-student-template-4A.csv";

  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(file)
      .pipe(csvParser({ 
        mapHeaders: ({ header }) => header.trim()
      }))
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {    
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      })
  });
}


export {
    parseCsv
}