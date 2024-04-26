/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/*const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");


initializeApp();*/
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onDocumentCreated } = require("firebase-functions/v2/firestore");


admin.initializeApp();

const firestore = admin.firestore();



// Initialize Pub/Sub



// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


//create field age range
exports.calculateAgeRange = functions.firestore
    .document('patients/{patientId}')
    .onCreate((snap, context) => {
        const patientData = snap.data();
        const birthDate = patientData.birthDate.toDate();
        const age = calculateAge(birthDate);
        let ageRange;

        if (age >= 60 && age <= 69) {
            ageRange = "YoungOld";
        } else if (age >= 70 && age <= 79) {
            ageRange = "MiddleOld";
        } else if (age >= 80) {
            ageRange = "VeryOld";
        } else {
            // Handle other cases if needed
            ageRange = "Unknown";
        }

        return admin.firestore().collection('patients').doc(context.params.patientId).update({
            ageRange: ageRange
        });
    });

function calculateAge(birthDate) {
    const today = new Date();
    const birthDateYear = birthDate.getFullYear();
    const birthDateMonth = birthDate.getMonth();
    const birthDateDay = birthDate.getDate();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    let age = todayYear - birthDateYear;
    if (todayMonth < birthDateMonth || (todayMonth === birthDateMonth && todayDay < birthDateDay)) {
        age--;
    }
    return age;
}


exports.createNewDocumentFromExisting = functions.firestore
    .document('patients/{patientId}/activities/{activityId}')
    .onCreate(async (snapshot, context) => {
        try {
            // Get data from the newly created document
            const newDocData = snapshot.data();

            // Extract patientId from context
            const patientId = context.params.patientId;

            // Extract date from new document data
            const timestamp = newDocData.timestamp; // Assuming you have a timestamp field in your data
            const date = timestamp.toDate(); // Convert timestamp to JavaScript Date object
            const dateString = formatDate(date); // Format the date as desired (e.g., "YYYY-MM-DD")

            // Add date as a field in the document data
            newDocData.date = dateString;

            // Create a reference to the subcollection where you want to create/update the document
            const subcollectionRef = firestore.collection('patients').doc(patientId).collection('dailysummary');

            // Query existing documents to check if there's a document with the same date
            const existingDocsQuery = subcollectionRef.where('date', '==', dateString);
            const existingDocsSnapshot = await existingDocsQuery.get();

            if (!existingDocsSnapshot.empty) {
                // If documents exist with the same date, update the first document found
                const existingDocRef = existingDocsSnapshot.docs[0].ref;
                const existingDocData = existingDocsSnapshot.docs[0].data();
                const mergedData = mergeActivities(existingDocData, newDocData);
                await existingDocRef.update(mergedData);
            } else {
                // If no document exists for the date, create a new document
                await subcollectionRef.add(newDocData);
            }

            console.log('New document created/updated successfully');
        } catch (error) {
            console.error('Error creating/updating document:', error);
        }
    });

// Helper function to merge activity durations for activities of the same type and date
function mergeActivities(existingData, newData) {
    const mergedData = { ...existingData };

    // Assuming you have separate fields for different activity types (e.g., sit_duration, stand_duration, sleep_duration)
    // You can adjust this based on your actual field names
    mergedData.sit = (mergedData.sit || 0) + (newData.sit || 0);
    mergedData.stand = (mergedData.stand || 0) + (newData.stand || 0);
    mergedData.sleep = (mergedData.sleep || 0) + (newData.sleep || 0);
    mergedData.sit_to_sleep = (mergedData.sit_to_sleep || 0) + (newData.sit_to_sleep || 0);
    mergedData.sit_to_stand = (mergedData.sit_to_stand || 0) + (newData.sit_to_stand || 0);
    mergedData.stand_to_sit = (mergedData.stand_to_sit || 0) + (newData.stand_to_sit || 0);
    mergedData.stand_to_sleep = (mergedData.stand_to_sleep || 0) + (newData.stand_to_sleep || 0);
    mergedData.sleep_to_sit = (mergedData.sleep_to_sit || 0) + (newData.sleep_to_sit || 0);
    mergedData.sleep_to_stand = (mergedData.sleep_to_stand || 0) + (newData.sleep_to_stand || 0);

    return mergedData;
}

// Helper function to format date as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

//function create dailysummary
exports.createWeeklySummaryOnActivityCreation = functions.firestore
    .document('patients/{patientId}/activities/{activityId}')
    .onCreate(async (snapshot, context) => {
        try {
            // Get current date
            const currentDate = new Date();

            // Calculate start and end dates of the current week
            const startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the current week (Sunday)
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6); // End of the current week (Saturday)

            // Format start and end dates
            const startDateString = formatDate(startDate);
            const endDateString = formatDate(endDate);

            // Extract patientId from context
            const patientId = context.params.patientId;

            // Get activities for the current week for this patient
            const weeklyActivitiesQuery = firestore.collection(`patients/${patientId}/activities`)
                                                .where('timestamp', '>=', startDate)
                                                .where('timestamp', '<=', endDate);
            const weeklyActivitiesSnapshot = await weeklyActivitiesQuery.get();

            if (!weeklyActivitiesSnapshot.empty) {
                // Calculate aggregated data for the week
                let weeklySummary = {
                    startDate: startDateString,
                    endDate: endDateString,
                    sit: 0,
                    stand: 0,
                    sleep: 0,
                    sit_to_sleep: 0,
                    sit_to_stand: 0,
                    stand_to_sit: 0,
                    stand_to_sleep: 0,
                    sleep_to_sit: 0,
                    sleep_to_stand: 0
                };

                weeklyActivitiesSnapshot.forEach((activityDoc) => {
                    const activityData = activityDoc.data();
                    weeklySummary.sit += activityData.sit || 0;
                    weeklySummary.stand += activityData.stand || 0;
                    weeklySummary.sleep += activityData.sleep || 0;
                    weeklySummary.sit_to_sleep += activityData.sit_to_sleep || 0;
                    weeklySummary.sit_to_stand += activityData.sit_to_stand || 0;
                    weeklySummary.stand_to_sit += activityData.stand_to_sit || 0;
                    weeklySummary.stand_to_sleep += activityData.stand_to_sleep || 0;
                    weeklySummary.sleep_to_sit += activityData.sleep_to_sit || 0;
                    weeklySummary.sleep_to_stand += activityData.sleep_to_stand || 0;
                });

                // Save the weekly summary to the database
                const weeklySummaryRef = firestore.collection(`patients/${patientId}/weeklysummary`).doc();
                await weeklySummaryRef.set(weeklySummary);
            }

            console.log('Weekly summary created successfully');
        } catch (error) {
            console.error('Error creating weekly summary:', error);
        }
    });



//function merge data grouped by age range
exports.createAgeRangeStatistics = functions.firestore.document('patients/{patientId}/activities/{activityId}')
    .onWrite(async (change, context) => {
        try {
            // Extract patient ID and activity data
            const patientId = context.params.patientId;
            const activityData = change.after.exists ? change.after.data() : null;

            // If activity data doesn't exist or if it's not an update, exit
            if (!activityData) {
                return null;
            }

            // Extract timestamp from activity data
            const timestamp = activityData.timestamp.toDate();
            console.log(timestamp);
            const dateString = formatDate(timestamp);

            // Extract age range of the patient
            const ageRange = await getPatientAgeRange(patientId);
            console.log(ageRange);


            // Construct the document ID for the age range and date
            const docId = `${dateString}_${ageRange}`;

            // Get existing document or create new one
            const ageRangeDocRef = firestore.collection('age_range_statistics').doc(docId);
            const ageRangeDoc = await ageRangeDocRef.get();
            const ageRangeData = ageRangeDoc.exists ? ageRangeDoc.data() : initializeAgeRangeData();

            // Merge activity data into age range document
            for (const key in activityData) {
                if (key !== 'timestamp') {
                    if (ageRangeData.hasOwnProperty(key)) {
                        ageRangeData[key].total += activityData[key];
                        console.log(ageRangeData[key].total);
                        console.log("ok");

                    } else {
                        // If the key doesn't exist in ageRangeData, create it
                        ageRangeData[key] = { total: activityData[key] };
                    }
                }
            }

            // Get all activities for the age range and date
            const activitiesSnapshot = await firestore.collection('patients')
                .where('ageRange', '==', ageRange)
                // .where('activities', 'array-contains', timestamp)
                .get();

            console.log("Number of documents retrieved:", activitiesSnapshot.size);

            // Log retrieved documents for further inspection
            activitiesSnapshot.forEach(doc => {
                console.log("Retrieved document ID:", doc.id);
                console.log("Document data:", doc.data());
            });


            // Calculate unique patient count for the age range and date
            const uniquePatientIds = new Set();

            for (const doc of activitiesSnapshot.docs) {
                const patientId = doc.id;
                console.log(patientId);
                uniquePatientIds.add(patientId);
            }

            const totalPatients = uniquePatientIds.size;
            console.log(totalPatients);

            // Calculate average activity duration for each activity type
            for (const key in ageRangeData) {
                if (key !== 'timestamp' && key !== 'date' && key !== 'ageRange') {
                    const total = ageRangeData[key].total;
                    //ageRangeData[key].totalPatientsCount = totalPatients;
                    const totalPatientsCount = totalPatients > 0 ? totalPatients : 1; // Prevent division by zero
                    ageRangeData[key].average = total / totalPatientsCount;
                }
            }

            // Merge activity data into age range document
            for (const key in activityData) {
                if (key !== 'timestamp') {
                    if (ageRangeData.hasOwnProperty(key)) {
                        ageRangeData[key].totalPatientsCount = totalPatients;

                    }
                }
            }


            // Set age range and timestamp
            ageRangeData.ageRange = ageRange;
            ageRangeData.timestamp = timestamp;

            // Save or update the document in the age range statistics collection
            await ageRangeDocRef.set(ageRangeData);

            console.log('Age range statistics updated successfully');
        } catch (error) {
            console.error('Error updating age range statistics:', error);
        }
    });
async function getPatientAgeRange(patientId) {
    const patientSnapshot = await firestore.collection('patients').doc(patientId).get();
    if (patientSnapshot.exists) {
        const birthDate = patientSnapshot.data().birthDate.toDate();
        const age = calculateAge(birthDate);
        if (age >= 60 && age <= 69) {
            return 'YoungOld';
        } else if (age >= 70 && age <= 79) {
            return 'MiddleOld';
        } else if (age >= 80) {
            return 'VeryOld';
        }
    }
    return null; // Return null if age range cannot be determined
}

// Helper function to calculate age from birth date
function calculateAge(birthDate) {
    const today = new Date();
    const diff = today - birthDate;
    const ageDate = new Date(diff); // Milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Convert milliseconds to years
}

// Helper function to initialize age range data
function initializeAgeRangeData() {
    return {
        timestamp: null,
        sit: { total: 0, totalPatientsCount: 0, average: 0 },
        sit_to_stand: { total: 0, totalPatientsCount: 0, average: 0 },
        sit_to_sleep: { total: 0, totalPatientsCount: 0, average: 0 },
        stand: { total: 0, totalPatientsCount: 0, average: 0 },
        stand_to_sleep: { total: 0, totalPatientsCount: 0, average: 0 },
        stand_to_sit: { total: 0, totalPatientsCount: 0, average: 0 },
        sleep: { total: 0, totalPatientsCount: 0, average: 0 },
        sleep_to_stand: { total: 0, totalPatientsCount: 0, average: 0 },
        sleep_to_sit: { total: 0, totalPatientsCount: 0, average: 0 }
    };
}

// Helper function to format date as "YYYY-MM-DD"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

exports.createGenderStatistics = functions.firestore.document('patients/{patientId}/activities/{activityId}')
    .onWrite(async (change, context) => {
        try {
            // Extract patient ID and activity data
            const patientId = context.params.patientId;
            const activityData = change.after.exists ? change.after.data() : null;

            // If activity data doesn't exist or if it's not an update, exit
            if (!activityData) {
                return null;
            }

            // Extract timestamp from activity data
            const timestamp = activityData.timestamp.toDate();
            console.log(timestamp);
            const dateString = formatDate(timestamp);

            // Extract gender of the patient
            const gender = await getPatientGender(patientId);
            console.log(gender);

            // Construct the document ID for the gender and date
            const docId = `${dateString}_${gender}`;

            // Get existing document or create new one
            const genderDocRef = firestore.collection('gender_statistics').doc(docId);
            const genderDoc = await genderDocRef.get();
            const genderData = genderDoc.exists ? genderDoc.data() : initializeGenderData();

            // Merge activity data into gender document
            for (const key in activityData) {
                if (key !== 'timestamp') {
                    if (genderData.hasOwnProperty(key)) {
                        genderData[key].total += activityData[key];
                        console.log(genderData[key].total);
                        console.log("ok");
                    } else {
                        // If the key doesn't exist in genderData, create it
                        genderData[key] = { total: activityData[key] };
                    }
                }
            }

            // Get all activities for the gender and date
            const activitiesSnapshot = await firestore.collection('patients')
                .where('gender', '==', gender)
                // .where('activities', 'array-contains', timestamp)
                .get();

            console.log("Number of documents retrieved:", activitiesSnapshot.size);

            // Log retrieved documents for further inspection
            activitiesSnapshot.forEach(doc => {
                console.log("Retrieved document ID:", doc.id);
                console.log("Document data:", doc.data());
            });

            // Calculate unique patient count for the gender and date
            const uniquePatientIds = new Set();

            for (const doc of activitiesSnapshot.docs) {
                const patientId = doc.id;
                console.log(patientId);
                uniquePatientIds.add(patientId);
            }

            const totalPatients = uniquePatientIds.size;
            console.log(totalPatients);

            // Calculate average activity duration for each activity type
            for (const key in genderData) {
                if (key !== 'timestamp' && key !== 'date' && key !== 'gender') {
                    const total = genderData[key].total;
                    const totalPatientsCount = totalPatients > 0 ? totalPatients : 1; // Prevent division by zero
                    genderData[key].average = total / totalPatientsCount;
                }
            }

            // Merge activity data into gender document
            for (const key in activityData) {
                if (key !== 'timestamp') {
                    if (genderData.hasOwnProperty(key)) {
                        genderData[key].totalPatientsCount = totalPatients;
                    }
                }
            }

            // Set gender and timestamp
            genderData.gender = gender;
            genderData.timestamp = timestamp;

            // Save or update the document in the gender statistics collection
            await genderDocRef.set(genderData);

            console.log('Gender statistics updated successfully');
        } catch (error) {
            console.error('Error updating gender statistics:', error);
        }
    });

async function getPatientGender(patientId) {
    const patientSnapshot = await firestore.collection('patients').doc(patientId).get();
    if (patientSnapshot.exists) {
        return patientSnapshot.data().gender; // Assuming 'gender' is a field in the patient document
    }
    return null; // Return null if gender cannot be determined
}

// Helper function to initialize gender data
function initializeGenderData() {
    return {
        timestamp: null,
        sit: { total: 0, totalPatientsCount: 0, average: 0 },
        sit_to_stand: { total: 0, totalPatientsCount: 0, average: 0 },
        sit_to_sleep: { total: 0, totalPatientsCount: 0, average: 0 },
        stand: { total: 0, totalPatientsCount: 0, average: 0 },
        stand_to_sleep: { total: 0, totalPatientsCount: 0, average: 0 },
        stand_to_sit: { total: 0, totalPatientsCount: 0, average: 0 },
        sleep: { total: 0, totalPatientsCount: 0, average: 0 },
        sleep_to_stand: { total: 0, totalPatientsCount: 0, average: 0 },
        sleep_to_sit: { total: 0, totalPatientsCount: 0, average: 0 }
    };
}
