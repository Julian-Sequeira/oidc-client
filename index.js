const { Issuer, generators } = require('openid-client');
const axios = require('axios');

// OIDC Client Functionality
let localIssuer;
let client;
let code_verifier;
let code_challenge;
let redirect_uri = 'http://localhost:4444/callback';

async function establishOIDCClient() {
    localIssuer = await Issuer.discover('http://localhost:3333/.well-known/openid-configuration');
    // console.log('Discovered issuer %s %O', localIssuer, localIssuer.metadata);

    client = new localIssuer.Client({
        client_id: 'localClient',
        client_secret: 'TQV5U29k1gHibH5bx1layBo0OSAvAbRT3UYW3EWrSYBB5swxjVfWUa1BS8lqzxG/0v9wruMcrGadany3',
        redirect_uris: [redirect_uri],
        response_types: ['code']
    });

    // Random nonce generated to protect against replays
    code_verifier = generators.codeVerifier();
    code_challenge = generators.codeChallenge(code_verifier);

    // nonce is needed to prevent a race condition
    // we don't want the IdP to create a dummy user-agent and create a successful auth flow in the middle of this one
}

function getAuthRedirectUrl() {
    return client.authorizationUrl({
        scope: 'openid',
        code_challenge,
        code_challenge_method: 'S256'
    })
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

router.get("root", "/", (ctx) => {
    return ctx.render("index", {});
});

router.get("authInitiate", "/authenticate", async (ctx) => {
    await establishOIDCClient();
    let authRedirectUrl = getAuthRedirectUrl();
    console.log(authRedirectUrl + "\n");
    ctx.response.status = 302;
    ctx.response.set('Location', authRedirectUrl);
});

router.get("authCallback", "/callback", async (ctx) => {
    const params = client.callbackParams(ctx.req);
    console.log(params);
    console.log("\n");

    const tokenSet = await client.callback(redirect_uri, params, {code_verifier});
    console.log('received and validated tokens %j \n', tokenSet);
    console.log('validated ID Token claims %j \n', tokenSet.claims());

    const username = tokenSet.claims().sub;
    ctx.response.status = 200;
    ctx.body = `<center><h2 style="color:green">Welcome ${username}</h2><center>`;
});

app.use(router.routes()).use(router.allowedMethods());
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`running on port ${PORT}`));
