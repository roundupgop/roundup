export default interface RestfulResponse {
    success: boolean,
    body: {[index: string]: any} | undefined
}