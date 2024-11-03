/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

require('dotenv').config();
const functions = require("firebase-functions/v1");
//const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { Timestamp } = require('firebase-admin/firestore');
admin.initializeApp();

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const MAX_DELAY = 60000; // 1 minute

// Function to send heartbeat data
exports.checkForDelayedActivities = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
    const now = Date.now();
    const oneMinuteInMillis = 60000; // 1 minute in milliseconds
  

    try {
        // Retrieve the most recent activity document from all patient activities
        const snapshot = await admin.firestore()
    
            .collectionGroup('activities') // Using collectionGroup to query all activities subcollections
            .orderBy('timestamp', 'desc') // Order by timestamp descending
            .limit(1) // Get only the newest document
            .get();
            console.log(snapshot);


        if (snapshot.empty) {
            console.log('No activities found.');
            return;
        }

        // Get the most recent document
        const latestDoc = snapshot.docs[0];
        const data = latestDoc.data();
        const timestamp = data.timestamp.toMillis(); // Convert Firestore Timestamp to milliseconds
        const timeGap = now - timestamp; // Calculate the gap in milliseconds

        console.log(`Latest Document ID: ${latestDoc.id}, Timestamp: ${new Date(timestamp).toISOString()}, Time Gap: ${timeGap / 1000} seconds`);

        // Check if the gap is greater than 1 minute
        if (timeGap > oneMinuteInMillis) {
            console.log(`Alert! Latest Document ID ${latestDoc.id} has not sent data for more than 1 minute.`);
            
            // Create a new document in the heartbeat collection to log the alert
            await admin.firestore().collection('heartbeat').add({
                //deviceId: data.deviceId || latestDoc.id, // Store the device ID or use document ID
                //timestamp: admin.firestore.FieldValue.serverTimestamp(), // Current time of the alert
                alertMessage: 'No data received for more than 1 minute since last activity.'
            });
            console.log("Heartbeat document successfully created.");
        } else {
            console.log('Data is being received within the acceptable timeframe.');
        }
    } catch (error) {
        console.error('Error checking for delayed activities:', error);
    }

    return null;
});


//send message to email function 
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'Tester1.heartbeat@gmail.com',
        pass: 'pycc tabf wziq znjh'
    }
});


console.log('Configured Email Username:', transporter.options.auth.user);
// Replace with the actual recipient email
const emailRecipient = "kunyarat.may12@gmail.com";

exports.sendEmailNotification = functions.firestore

    .document('heartbeat/{heartbeatId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const deviceId = data.deviceId;

        const mailOptions = {
            from: 'Tester1.heartbeat@gmail.com',
            to: emailRecipient,
            subject: 'Alert: Missing Data Detected',
            text: `The device has not sent any data within the last 1 minute.`,
            html: `<p>The device has not sent any data within the last 1 minute.</p>`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email notification sent for missing data`);
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    });


