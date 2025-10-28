import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'; dotenv.config();
import { readFile } from 'fs/promises';
import jwt from 'jsonwebtoken';

import { firebaseDB } from './firebase.js';
import { parseCsv } from './utils.js';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());

// logs ALL incoming requests
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body);
//   next();
// });

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; // Attach user data to request object
    next();
  });
};

app.post('/user/register', async (req, res) => {
  const accounts = await parseCsv();

  const targetCollection = firebaseDB.collection("users");
  accounts.forEach(async (data) => {
    data.password = await bcrypt.hash(data.password, 10);
    const insert = await targetCollection.add(data);
  });

  res.send("User inserted!!!!");
});

app.post('/user/group-role-update', authenticateToken, async (req, res) => {
  const { group, role } = req.body;
  const userId = req.user.id_number;

  // Validate input
  if (!userId || !group || !role) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // check user data if exists
    const userQuery = await firebaseDB.collection('users').where("id_number", "==", String(userId)).limit(1).get();
    if (userQuery.empty) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // get doc ref and update user profile
    const userRef = userQuery.docs[0].ref;
    await userRef.update({ group, role });

    return res.status(200).json({ message: 'User role updated successfully.' });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ message: 'Failed to update user role.' });
  }
});

app.get('/evaluate/load', authenticateToken, async (req, res) => {
  try {
    // const { evaluateDate } = req.query;
    const { role, group, section } = req.user;
    console.log('Authenticated user data:', req.user);
    // fetch evaluations criteria
    const criteriaQuery = await firebaseDB.collection('questions')
      .get();
    const criteria = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: []
    }
    criteriaQuery.forEach(doc => {
      const data = doc.data();
      const documentId = doc.id;
      const { text, type, scaleMin, scaleMax } = data;
      const role = data.role;
      if (role?.length > 0) {
        for (let r of role) {
          criteria[r].push({ text, type, scaleMin, scaleMax, documentId });
        }
      }
    });
    // fetch group members
    console.log('group:', group, ' section:', section, ' role:', role);
    const groupMembersQuery = await firebaseDB.collection('users')
      .where('group', '==', group)
      .where('section', '==', section)
      .where('role', '!=', role)
      .get();
    const assignRateesBasedOnRole = {
      1: [2, 3, 4], // team manager evaluates lead programmer, API tester, document specialist
      2: [1, 5], // lead programmer evaluates ...
      3: [1, 2],  // API Tester evaluates ...
      4: [1, 2], // document specialist evaluates ...
      5: [2] // API Programmer evaluates ...
    }

    const membersToBeEvaluated = [];

    groupMembersQuery.forEach(doc => {
      const data = doc.data();
      const memberRole = parseInt(data.role);
      console.log('memberRole:', memberRole, ' type:', typeof memberRole);
      if (assignRateesBasedOnRole[role].includes(memberRole)) {
        membersToBeEvaluated.push({
          id: doc.id,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name,
          id_number: data.id_number,
          role: data.role,
        });
      }
    });

    return res.status(200).json({ membersToBeEvaluated, criteria });

  } catch (error) {
    console.error("Error in /evaluate/load endpoint:", error);
    return res.status(500).json({ message: "Server error encountered." });
  }
});

app.post('/user/roles', async (req, res) => {
  try {
    const roles = await readFile("datasets/roles.json", { encoding: "utf-8" });
    const jsonData = JSON.parse(roles);
    console.log(jsonData)

    const targetCollection = firebaseDB.collection('roles');
    for (let data of jsonData?.data) {
      console.log(data)
      const insert = await targetCollection.add(data);
    }

    return res.status(200).json({ message: "Role successfully saved!" });
  } catch (error) {
    console.error("Error in /roles endpoint:", error);
    return res.status(500).json({ message: "Server error encountered." });
  }
});

app.post('/evaluate/criteria', async (req, res) => {
  try {
    const criteria = await readFile("datasets/criteria.json", { encoding: "utf-8" });
    const jsonData = JSON.parse(criteria);
    console.log(jsonData)

    const targetCollection = firebaseDB.collection('questions');
    for (let data of jsonData?.data) {
      console.log(data)
      const insert = await targetCollection.add(data);
    }

    return res.status(200).json({ message: "Criteria successfully saved!" });
  } catch (error) {
    console.error("Error in /criteria endpoint:", error);
    return res.status(500).json({ message: "Server error encountered." });
  }
});

app.get('/user/login', async (req, res) => {
  const { id_number, password } = req.query;

  console.log('id_number: ', id_number)
  const targetCollection = firebaseDB.collection("users");
  const validationResult = await targetCollection
    .where('id_number', '==', String(id_number))
    .limit(1)
    .get();

  if (validationResult.empty) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const userDoc = validationResult.docs[0];
  const user = userDoc.data();

  //compare password
  const validatePassword = await bcrypt.compare(password, user?.password);
  if (!validatePassword) {
    return res.status(401).json({ message: "Invalid password." })
  }

  // Create JWT token
  const tokenPayload = {
    id: userDoc.id,
    id_number: user.id_number,
    first_name: user.first_name,
    last_name: user.last_name,
    middle_name: user.middle_name,
    role: user?.role,
    year_level: user?.year_level,
    section: user?.section,
    group: user?.group,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

  return res.status(200).json({
    message: "Login successful",
    token: token,
    user: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      middle_name: user?.middle_name,
      id_number: user?.id_number
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





