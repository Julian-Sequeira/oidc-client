const { Issuer, generators } = require('openid-client');


const express = require('express');

// OIDC Client Functionality
async function establishOIDCClient() {
    const localIssuer = await Issuer.discover('http://localhost:3333/.well-known/openid-configuration');
    console.log('Discovered issuer %s %O', localIssuer, localIssuer.metadata);

    let redirectUri = 'http:/localhost:4444/callback';
    const client = new localIssuer.Client({
        client_id: 'localClient',
        client_secret: 'TQV5U29k1gHibH5bx1layBo0OSAvAbRT3UYW3EWrSYBB5swxjVfWUa1BS8lqzxG/0v9wruMcrGadany3',
        redirect_uris: [redirectUri],
        response_types: ['code']
    });

    // Random nonce generated to protect against replays
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);

    console.log (
        client.authorizationUrl({
            scope: 'openid',
            code_challenge,
            code_challenge_method: 'S256',
        })
    );
}




// const params = client.callbackParams(req);
// const tokenSet = await client.callback(redirectUri, params, { code_verifier });
// console.log("Received the token!");
// console.log("Here's what the token looks like %j", tokenSet);
// console.log("Here are the claims the token has access to: %j", tokenSet.claims());


// Web Server Functionality

const koa = require("koa");
const path = require("path");
const render = require("koa-ejs");
const koaRouter = require("koa-router");
const { createGzip } = require('zlib');

const app = new koa();
const router = new koaRouter();

render(app, {
    root: path.join(__dirname, "views"),
    layout: "index",
    viewExt: "html"
});

router.get("hello", "/", (ctx) => {
    establishOIDCClient();
    ctx.body = "<h1>Hello World!!</h1>";
});

app.use(router.routes()).use(router.allowedMethods());
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`running on port ${PORT}`));








// const app = express();
// const port = 4444;

// app.get('/', (req, res) => {
//     establishOIDCClient();
//     res.send('Hello World!');
// })

// app.listen(port, () => {
//     console.log(`Example application listening on port ${port}`);
// })