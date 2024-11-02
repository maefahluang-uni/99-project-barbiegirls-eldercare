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



/*exports.checkHeartbeatContinuity = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
    console.log('Starting heartbeat check...');
    const now = Date.now();
    const cutoff = now - 10000; // 10 seconds cutoff
    const emailRecipient = "kunyarat.may12@gmail.com";
    
    try {
        // Query Firestore for documents older than the cutoff time
        console.log('Querying Firestore for activities older than cutoff time...');
        const snapshot = await admin.firestore().collection('patients').doc().collection('activities')
            .where('timestamp', '<', cutoff)
            .get();

        console.log(`Query returned ${snapshot.size} documents.`);
        
        if (!snapshot.empty) {
            let missingHeartbeats = [];
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                missingHeartbeats.push(data.deviceId || doc.id);
                console.log(`Missing heartbeat for device: ${data.deviceId || doc.id}`);
            });

            if (missingHeartbeats.length > 0) {
                console.log('Sending email notification...');
                await sendEmailNotification(missingHeartbeats, emailRecipient);
                console.log('Email notification sent successfully.');
            }
        } else {
            console.log('No missing heartbeats detected within the cutoff time.');
        }
    } catch (error) {
        console.error('Error checking heartbeat continuity:', error);
    }

    console.log('Heartbeat check completed.');
    return null;
});


// Function to send email notification
async function sendEmailNotification(missingHeartbeats, emailRecipient) {
    const mailOptions = {
        from: 'Tester1.heartbeat@gmail.com',
        to: emailRecipient,
        subject: 'Alert: Missing Heartbeat Detected',
        text: `The following devices have not sent a heartbeat within the last 10 seconds:\n\n${missingHeartbeats.join('\n')}`,
        html: `<p>The following devices have not sent a heartbeat within the last 10 seconds:</p><ul>${missingHeartbeats.map(deviceId => `<li>${deviceId}</li>`).join('')}</ul>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent to:', emailRecipient);
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
}

*/

exports.HeartbeatsDetecting = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
    console.log('Starting heartbeat check...');
    const now = Date.now();
    const cutoffTimestamp = Timestamp.fromMillis(now - 10000); // Convert cutoff time to Firestore Timestamp

    try {
        // Query Firestore for activities with timestamp older than cutoff
        console.log('Querying Firestore for activities older than cutoff time...');
        const snapshot = await admin.firestore()
            .collection('patients')
            .doc() // Ensure you specify the correct document ID if needed
            .collection('activities')
            .where('timestamp', '<', cutoffTimestamp)
            .get();

        console.log(`Query returned ${snapshot.size} documents.`);

        if (!snapshot.empty) {
            let missingHeartbeats = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                const deviceId = data.deviceId || doc.id;

                missingHeartbeats.push(deviceId);
                console.log(`Missing heartbeat detected for device: ${deviceId}`);

                // Add a document to the heartbeat collection for each missing device
                admin.firestore().collection('heartbeat').add({
                    deviceId: deviceId,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            });
        } else {
            console.log('No missing heartbeats detected within the cutoff time.');
        }
    } catch (error) {
        console.error('Error checking heartbeat continuity:', error);
    }

    console.log('Heartbeat check completed.');
    return null;
});

const mockContext = {
    eventId: '123456',
    eventType: 'google.pubsub.topic.publish',
    timestamp: Date.now(),
    // Add other properties as needed to simulate your context
};





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
            text: `The device has not sent any data within the last 10 seconds.`,
            html: `<p>The device has not sent any data within the last 10 seconds.</p>`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email notification sent for missing data`);
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    });


