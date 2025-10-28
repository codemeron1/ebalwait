import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import fs from 'fs';

const serviceAccount = JSON.parse(
    fs.readFileSync("./fbKey.json", "utf8")
);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const firebaseDB = getFirestore(app);

export { firebaseDB };