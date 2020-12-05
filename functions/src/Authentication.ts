import { QueryDocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import AuthenticationResponse from "./AuthenticationResponse";
import Plaid from "./Plaid";

const admin = require('firebase-admin');


const db = admin.firestore();


export default class Authentication {

    constructor(request: any) {

    }

    async auth(user_id: string): Promise<AuthenticationResponse> {
        
        let plaid = new Plaid(user_id)
    
        let auth_token_response: QueryDocumentSnapshot = await db.collection('private_plaid').doc(user_id).get()
        let auth_token: string = auth_token_response.get('access_token')

        return {
            auth_token: auth_token,
            plaid: plaid
        }

    }


}