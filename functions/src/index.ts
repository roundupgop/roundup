import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import Dictionary from './Dictionary';

import Plaid from './Plaid'
import Transaction from './Transaction';

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const storeUserPublicLinkToken = functions.https.onRequest(async (request, response) => {

    let body: Dictionary = JSON.parse(request.body)

    console.dir(body)

    let plaid = new Plaid('sample_user_id')
    let token = await plaid.getAccessToken(body['public_link_token'])
    
    if(token != undefined) {
        db.collection('private_plaid').doc('sample_user_id').set({
            access_token: token
        })
        response.send("Inserted for sample_user_id")
    } else {
        response.send("Error")
    }
});

export const getTransactionsThisPeriod = functions.https.onRequest(async (request, response) => {

    console.dir("In the updated getTransactionsThisPeriod")

    let plaid = new Plaid('sample_user_id')
    
    let auth_token_response: QueryDocumentSnapshot = await db.collection('private_plaid').doc('sample_user_id').get()
    let auth_token: string = auth_token_response.get('access_token')
    console.dir(auth_token)

    let transactions: Transaction[] = await plaid.getTransactionsThisPeriod(auth_token, "2020-11-01", "2020-11-26")
    console.dir(transactions)

});