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

## Library Documentation Notes

Abstract Control Flow Steps:
* Create an Issuer with metadata parameters (can use a .well-known endpoint to do this)
* Create a client object using the `issuer.Client` method



### Client Callback
* performs the callback for the auth server's authorization response

## Passport

Authentication middleware for node.js applications
