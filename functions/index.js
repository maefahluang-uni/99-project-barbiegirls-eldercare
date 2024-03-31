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
const {onDocumentCreated} = require("firebase-functions/v2/firestore");


admin.initializeApp();

const firestore = admin.firestore();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

/*exports.helloWorld = onRequest((request, response) => {
   logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
});*/

 

/*exports.createNewDocumentFromExistingwithrequest = functions.https.onRequest(async (req, res) => {
    try {
        // Get data from an existing document
        const existingDocRef = firestore.collection('patients').doc('01').collection('activities').doc('activitylog1');
        const existingDocSnapshot = await existingDocRef.get();

        if (!existingDocSnapshot.exists) {
            return res.status(404).send('Existing document not found');
        }

        const existingData = existingDocSnapshot.data();

        // Create a new document with the same data
        const newDocRef = firestore.collection('patients').doc('01').collection('dailysummary').doc(); // Creates a new document with a unique ID
        await newDocRef.set(existingData);

        return res.status(200).send('New document created successfully');
    } catch (error) {
        console.error('Error creating new document:', error);
        return res.status(500).send('Error creating new document');
    }
});*/

/*exports.createuser = onDocumentCreated("patients/01", async (event) => {
    try {
        // Get data from an existing document
        const existingDocRef = firestore.collection('patients').doc('01');
        const existingDocSnapshot = await existingDocRef.get();

        if (!existingDocSnapshot.exists) {
            return res.status(404).send('Existing document not found');
        }

        const existingData = existingDocSnapshot.data();

        // Create a new document with the same data
        const newDocRef = firestore.collection('patients').doc(); // Creates a new document with a unique ID
        await newDocRef.set(existingData);

        return res.status(200).send('New document created successfully');
    } catch (error) {
        console.error('Error creating new document:', error);
        return res.status(500).send('Error creating new document');
    }
});*/


exports.createNewDocumentFromExisting = onDocumentCreated('patients/{patientId}/activities/{activiylogId}', async (event) => {
    try {
        // Get data from the newly created document
        const newDocData = event.data();

        // Create a new document with the same data
        const newDocRef = firestore.collection('patients').doc('{patientId}').collection('dailysummary').doc(); // Creates a new document with a unique ID
        await newDocRef.set(newDocData);

        console.log('New document created successfully');
    } catch (error) {
        console.error('Error creating new document:', error);
    }
});


