const fetch = require('node-fetch');

import RestfulResponse from './RestfulResponse'

export default class Rest {
    static async post(
        url: string, 
        body: {[index: string]: any}, 
        cors: boolean = true,
        responseChecker: ((json: {[index: string]: any}) => boolean) | undefined,
    ): Promise<RestfulResponse> {
        
        let restfulResponse: RestfulResponse = {
            success: false,
            body: undefined
        }

        try {
            const resp = await fetch(
                url,
                {
                    method: 'POST',
                    mode: cors ? 'cors' : 'no-cors',
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            )

            restfulResponse.body = await resp.json()
            restfulResponse.success = responseChecker == undefined ? true : responseChecker(restfulResponse.body!)

        } catch (e) {
            console.error(e)
        } finally {
            return restfulResponse
        }

    }
}