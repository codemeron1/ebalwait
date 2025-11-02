import { firebaseDB } from '../firebase.js';
// import { UserData, ClassDates } from '../types/types.js';


export const getClassDates = async () => {
    const classDateQuery = await firebaseDB.collection('evaluationDate').get();
    const classDates = [];
    classDateQuery.forEach((userDoc) => {
        const data = doc.data();
        classDates.push({
            documentId: doc.id,
            date: data.date,
        });
    });

    return classDates;
}

export const getRatees = async (currentUserData) => {
    console.log('getRatees(): ', currentUserData);
    const { group: currentUserGroup, role: currentUserRole, section: currentUserSection } = currentUserData;
    const assignRateesBasedOnRole = {
        1: [2, 3, 4], // team manager evaluates lead programmer, API tester, document specialist
        2: [1, 5], // lead programmer evaluates ...
        3: [1, 2],  // API Tester evaluates ...
        4: [1, 2], // document specialist evaluates ...
        5: [2] // API Programmer evaluates ...
    }

    //roles that you can rate
    console.log({
        group: currentUserGroup,
        role: currentUserRole,
        section: currentUserSection
    });
    const rolesThatCanBeRate = assignRateesBasedOnRole[Number(currentUserRole)];

    // fetch group members
    const ratees = [];
    const groupMembersQuery = await firebaseDB.collection('users')
        .where('group', '==', currentUserGroup)
        .where('section', '==', currentUserSection)
        .where('role', '!=', currentUserRole)
        .get();
    groupMembersQuery.forEach((doc) => {
        const memberDocId = doc.id;
        const memberData = doc.data();
        const memberRole = memberData.role;

        if (rolesThatCanBeRate.includes(Number(memberRole))) {
            ratees.push({...memberData, id: memberDocId});
        }
    });

    return ratees;
}