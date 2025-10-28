import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import csvParser from 'csv-parser';
import { firebaseDB } from './firebase.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());


app.post('/register', async (req, res) => {
  const accounts = await parseCsv();

  // const targetCollection = firebaseDB.collection("users");
  // accounts.forEach( async (data) => {
  //   const insert = await targetCollection.add(data);
  //   console.log(`User inserted: ${insert.id}`);
  // });

   res.send("User inserted!!!!");
});

app.post('/login', async(req, res) => {
  const userCreds = req.body;

  const all = await firebaseDB.collection("users").get();
  all.forEach(doc => {
    console.log(doc.data())
    // const stored = doc.data().id_number;
    // console.log("Stored:", `[${stored}]`, "length:", stored.length);
  });

  const targetCollection = firebaseDB.collection("users");
  console.log("Received ID:", userCreds.id_number, typeof userCreds.id_number);
  const validationResult = await targetCollection
      .where('id_number', '==', String(userCreds.id_number))
      .limit(1)
      .get();

  if (validationResult.empty) {
    return res.status(404).json({message: 'User not found.'});
  } 

  res.send(userCreds);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const parseCsv = () => {
  const file = "./sample.csv";

  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(file)
      .pipe(csvParser({ 
        mapHeaders: ({ header }) => header.trim()
      }))
      .on('data', (row) => {
        console.log(row);
        console.log("id_number", row?.id_number);
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




