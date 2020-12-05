import * as functions from 'firebase-functions';

const cors = require('cors')({origin: true});

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

import Dictionary from './Dictionary';

// import Plaid from './Plaid'
// import Transaction from './Transaction';

import Authentication from './Authentication'
import AuthenticationResponse from './AuthenticationResponse';

export const createLinkToken = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        let resp: AuthenticationResponse = await bootstrap('sample_user_id')
    
        let createTokenResp = await resp.plaid.createLinkToken()
    
        response.send(JSON.stringify(createTokenResp))
    })

});

export const storeUserPublicLinkToken = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        let body: Dictionary = JSON.parse(request.body)
        let resp: AuthenticationResponse = await bootstrap('sample_user_id')

        let token = await resp.plaid.getAccessToken(body['public_link_token'])
    
        if(token != undefined) {
            db.collection('private_plaid').doc('sample_user_id').set({
                access_token: token
            })
            response.send("Inserted for sample_user_id")
        } else {
            response.send("Error")
        }
    })
});

// export const getTransactionsThisPeriod = functions.https.onRequest(async (request, response) => {

//     console.dir("In the updated getTransactionsThisPeriod")

     
    
//     if(auth_token != undefined) {

//         let transactions: Transaction[] = await plaid.getTransactionsThisPeriod(auth_token, "2020-11-01", "2020-11-26")
    
//         for(let transaction of transactions) {
//             console.log(transaction.name + " (" + transaction.date + ")  -  $" + transaction.amount)
//         }

//     }

//     else {
        
//     }

// });

async function bootstrap(request: any): Promise<AuthenticationResponse> {
    let auth = new Authentication(request)
    let resp = await auth.auth('sample_user_id')
    return resp;
}