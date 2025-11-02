import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'; dotenv.config();
import { readFile } from 'fs/promises';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import { firebaseDB } from './firebase.js';
import { parseCsv } from './utils/utils.js';
import { getClassDates, getRatees } from "./utils/firebase.js";

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());
app.use(cors()); //TODO change this later....

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
      id: userDoc.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      middle_name: user?.middle_name,
      id_number: user?.id_number,
      role: user?.role,
    }
  });
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

app.get('/home/load-data', authenticateToken, async (req, res) => {
  try {
    const teamMembers = [];
    const pendingEvaluations = [];
    let {
      section: currentUserSection,
      group: currentUserGroup,
      id: currentUserDocumentId
    } = req.user;
    //get team members
    const teamMembersQuery = await firebaseDB.collection('users')
      .where('group', '==', currentUserGroup)
      .where('section', '==', currentUserSection)
      .get()
    teamMembersQuery.forEach((doc) => {
      teamMembers.push({ ...doc.data() });
    });
    //get pending evaluation
    const classDates = await getClassDates();
    const ratees = await getRatees(req.user);

    //check evaluation for each date
    const evaluatorId = req.user?.id;

    for (const date of classDates) {
      const classDateId = date?.documentId;
      let pendingRateesCount = 0;
      for (const ratee of ratees) {
        const rateeId = ratee?.id;
        const alreadyEvaluatedQuery = await firebaseDB.collection('evaluationResult')
          .where('classDateId', '==', classDateId)
          .where('evaluatorId', '==', evaluatorId)
          .where('rateeId', '==', rateeId)
          .get();
        if (alreadyEvaluatedQuery.empty) {
          pendingRateesCount++;
        }
      }

      if (pendingRateesCount === 0) continue; //skip if no pending evaluations

      pendingEvaluations.push({
        ...date,
        pendingRateesCount
      });
    }

    //get evaluation summary

    return res.status(200).json({
      teamMembers,
      pendingEvaluations
    });
  } catch (error) {
    console.error("Error in /home/load-data endpoint:", error);
    return res.status(500).json({ message: "Server error encountered.", error: error.message });
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

app.get('/evaluate/ratees-load', authenticateToken, async (req, res) => {
  try {
    const { evaluateDate } = req.query;
    const currentUserId = req.user.id;
    const { role, group, section } = req.user;

    if (!evaluateDate) throw new Error("evaluateDate is empty or missing.")

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

    for (const doc of groupMembersQuery?.docs) {
      const data = doc.data();
      const rateeDocumentId = doc.id;
      //check if member is already evaluated by the current user;
      //based on: rateeDocId, currentUserId, classDateId
      const alreadyEvaluatedQuery = await firebaseDB.collection('evaluationResult')
        .where('classDateId', '==', evaluateDate)
        .where('evaluatorId', '==', currentUserId)
        .where('rateeId', '==', rateeDocumentId)
        .get();

      let alreadyEvaluatedStatus = false;
      if (!alreadyEvaluatedQuery.empty) {
        alreadyEvaluatedStatus = true;
      }

      const memberRole = parseInt(data.role);
      if (assignRateesBasedOnRole[role].includes(memberRole)) {
        membersToBeEvaluated.push({
          id: rateeDocumentId,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name,
          id_number: data.id_number,
          role: data.role,
          evaluationStatus: alreadyEvaluatedStatus
        });
      }
    }

    return res.status(200).json({ membersToBeEvaluated, criteria });
  } catch (error) {
    console.error("Error in /evaluate/load endpoint:", error);
    return res.status(500).json({ message: "Server error encountered." });
  }
});

app.get('/evaluate/class-dates', authenticateToken, async (req, res) => {
  try {

    const classDateQuery = await firebaseDB.collection('evaluationDate')
      .get();
    const classDates = [];
    classDateQuery.forEach(doc => {
      const data = doc.data();
      classDates.push({
        documentId: doc.id,
        date: data.date,
      });
    });

    return res.status(200).json({ classDates });

  } catch (error) {
    console.error("Error in /evaluate/load endpoint:", error);
    return res.status(500).json({ message: "Server error encountered." });
  }
});

app.post('/evaluate/result/save', async (req, res) => {
  try {
    const evaluationResultData = req.body;

    //check if evaluation result not exists
    const { rateeId, classDateId, evaluatorId } = evaluationResultData;
    const alreadyEvaluatedQuery = await firebaseDB.collection('evaluationResult')
      .where('classDateId', '==', classDateId)
      .where('evaluatorId', '==', evaluatorId)
      .where('rateeId', '==', rateeId)
      .get();
    if (!alreadyEvaluatedQuery.empty) throw new Error("Evaluation result already exists.");

    const targetCollection = firebaseDB.collection("evaluationResult");
    const insert = await targetCollection.add(evaluationResultData);

    res.status(200).json({ message: "Evaluation result saved successfully." });
  } catch (error) {
    console.error("Error saving evaluation result:", error);
    res.status(500).json({ message: "Server error encountered" });
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





