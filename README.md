# Test OIDC Client

Simple OIDC Client - press the login button to be redirected to an OIDC Provider.
If the authentication is successful, the client will display a "YOU MAY PASS" message.

To run the app:
* `npm init`
* `npm run-script client`


## Implementation Thoughts

Functionality With Old Client:
1. Client displays a web page to the user
2. User clicks `Sign in with IdP X`
3. Client sends an authorization redirect string to user's browser

New Exchange Flow:
1. Client consumes the callback
2. Passes the code verifier back to get the auth token
3. Call the `user-info` endpoint using the token

What other functionality is needed?
* Refresh Tokens? 
* Idp endpoint discovery? -- DONE

Need to wrap this whole thing into a web server, will do that using expressJS


## Library Documentation Notes

Abstract Control Flow Steps:
* Create an Issuer with metadata parameters (can use a .well-known endpoint to do this)
* Create a client object using the `issuer.Client` method (including a callback uri)
* Create a code verifier (`generators.codeVerifier()`) and a challenge (`generators.codeChallenge(code_verifier)`)
* Initiate the oidc flow by crafting a 302 redirect for the browser that takes them to the IdP -- `client.authorizationUrl(scope, code_verifier, code_challenge)`
* Wait for an authentication response at the callback uri endpoint
* Extract the authentication response parameters from the response -- `client.callbackParams(req)`
* Exchange for token using `client.callback(callback_uri, parameters, {code_verifier})`


### Client Callback
* performs the callback for the auth server's authorization response

## Passport

Authentication middleware for node.js applications

## Koa-EJS

* Accessing the request: `ctx.request`


