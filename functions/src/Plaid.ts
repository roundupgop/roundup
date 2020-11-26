import RestfulResponse from './RestfulResponse';
// import Secrets from './secrets'
import Urls from './urls'
import Rest from './Rest'
import Secrets from './secrets';
import Transaction from './Transaction';

const functions = require("firebase-functions");


export default class Plaid {

    // private uid: string;

    constructor(uid: string) {
        // this.uid = uid
    }

    async getAccessToken(public_token: string): Promise<string | undefined> {
        let response: RestfulResponse = await Rest.post(
            Urls.exchangeTokenUrl(),
            {
                client_id: Secrets.PLAID_CLIENT_ID,
                secret: Secrets.PLAID_SECRET,
                public_token: public_token
            },
            true,
            function (json: {[index: string]: any}): boolean {
                return Object.keys(json).filter(k => k == "access_token").length == 1
            }
        )

        return response.body == undefined ? undefined : response.body['access_token']

    }

    async getTransactionsThisPeriod(access_token: string, start_date: string, end_date: string): Promise<Transaction[]> {

        functions.logger.log("start_date:", start_date);
        functions.logger.log("end_date:", end_date);

        functions.logger.log("debug object:", {
            client_id: Secrets.PLAID_CLIENT_ID,
            secret: Secrets.PLAID_SECRET,
            access_token: access_token,
            start_date: start_date,
            end_date: end_date,
            options: {
                count: 250
            }
        });


        let transactions: Transaction[] = []

        let response: RestfulResponse = await Rest.post(
            Urls.getTransactions(),
            {
                client_id: Secrets.PLAID_CLIENT_ID,
                secret: Secrets.PLAID_SECRET,
                access_token: access_token,
                start_date: start_date,
                end_date: end_date,
                options: {
                    count: 250
                }
            },
            true,
            function (json: {[index: string]: any}): boolean {
                return Object.keys(json).filter(k => k == "transactions").length == 1
            }
        )

        console.dir(response)

        if(response.success) {
            transactions = response.body!['transactions']
        }
        
        return transactions
    }

}