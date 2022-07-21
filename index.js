import { Issuer, generators } from 'openid-client';

// Issuer Object for our IdP
const localIssuer = await Issuer.discover('http://localhost:3001/.well-known/openid-configuration');
console.log('Discovered issuer %s %O', localIssuer, localIssuer.metadata);

const client = new localIssuer.Client({
    client_id: 'localClient',
    client_secret: 'TQV5U29k1gHibH5bx1layBo0OSAvAbRT3UYW3EWrSYBB5swxjVfWUa1BS8lqzxG/0v9wruMcrGadany3',
    redirect_uris: ['http://localhost:3002/cb'],
    response_types: ['code']
});

// Random nonce generated to protect against replays
const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);

client.authorizationUrl({
    scope: 'openid',
    code_challenge,
    code_challenge_method: 'S256',
});

const params = client.callbackParams(req);
const tokenSet = await client.callback()