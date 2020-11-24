import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();

//const db = admin.firestore();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const storeUserPublicLinkToken = functions.https.onRequest(async (request, response) => {
    response.send("MEH")
    // try {
    //     await db.collection('private_plaid').doc('sample_user_id').set({
    //         access_token: request.params['public_link_token']
    //     })
    //     response.send("OK")
    // } catch(e: any) {
    //     response.send("ERROR")
    // }
});