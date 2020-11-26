export default class Urls {

    private static ENV = 'sandbox'

    static exchangeTokenUrl(): string {
        return 'https://' + this.ENV + '.plaid.com/item/public_token/exchange'
    }

    static getTransactions(): string {
        return 'https://' + this.ENV + '.plaid.com/transactions/get'
    }
}