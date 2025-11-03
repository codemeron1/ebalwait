import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

import fs from 'fs';
if (!fs.existsSync("./fbKey.json")) {
  const jsonString = Buffer.from(process.env.CONFIG_JSON_BASE64, "base64").toString();
  fs.writeFileSync("./fbKey.json", jsonString);
}
const serviceAccount = JSON.parse(
  fs.readFileSync("./fbKey.json", "utf8")
);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const firebaseDB = getFirestore(app);

export { firebaseDB };