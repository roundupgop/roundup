import RestfulResponse from './RestfulResponse';
// import Secrets from './secrets'
import Urls from './urls'
import Rest from './Rest'
import Secrets from './secrets';
import Transaction from './Transaction';

export default class Plaid {

    // private uid: string;

    constructor(uid: string) {
        // this.uid = uid
    }

    async createLinkToken(): Promise<{
        success: boolean,
        expiration: string | undefined,
        link_token: string | undefined,
        request_id: string | undefined
    }> {

        let resp = {
          success: false,
          expiration: undefined,
          link_token: undefined,
          request_id: undefined
        }

        let response: RestfulResponse = await Rest.post(
            'https://sandbox.plaid.com/link/token/create',
            {
                client_id: "5f864f0d93b37b0012444bc5",
                secret: "cb8a141e4d09a81504d935bae44f1e",
                client_name: "Roundup For Republicans",
                country_codes: [
                    "US"
                ],
                language: "en",
                user: {
                    client_user_id: "unique_user_id"
                },
                products: [
                    "auth"
                ]
              },
            true,
            function (json: {[index: string]: any}): boolean {
                return Object.keys(json).filter(k => k == "access_token").length == 1
            }
        )

        const json = response.body!
    
        resp['success'] = true
        resp['expiration'] = json['expiration']
        resp['link_token'] = json['link_token']
        resp['request_id'] = json['request_id']
    
        return resp
    
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

        if(response.success) {
            transactions = response.body!['transactions']
        }
        
        return transactions
    }

}