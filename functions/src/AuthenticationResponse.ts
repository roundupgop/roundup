import Plaid from "./Plaid";

export default interface AuthenticationResponse {
    auth_token: string,
    plaid: Plaid
}