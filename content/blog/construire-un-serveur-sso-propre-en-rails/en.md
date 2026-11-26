---
title: "Building a clean SSO server in Rails"
slug: building-a-clean-sso-server-in-rails
date: 2026-12-14
author: "Nicolas Rouanne"
cover: "cover-en.jpg"
excerpt: "An exploration: an auth server in Rails with Devise, Doorkeeper and OpenID Connect, APIs that verify its tokens by themselves, and a browser that keeps no refresh token."
---

A login often starts simple and grows by layers: email and password, then a Google button, then a customer who wants to sign in with their company's SSO, then two-factor. And next to the Rails app there is often a second service, in Python, which also needs to know who is calling. We wanted to see what a clean version of that looks like when you build it yourself, in Rails, with OAuth 2 and OpenID Connect at the centre.

It's an exploration, and Adrien Lupo wrote most of the code. Everything runs locally, nothing is deployed, and the Python API isn't merged yet.

The idea fits in a few sentences. The app never sees a password. A separate server, the SSO, checks who the person is. The app's backend asks it once, at login, then knows the browser by a cookie no script can read. Other services show a short-lived signed token instead, and the page can get one, valid 15 minutes, to call the second API. The rest of this article takes those sentences one at a time.

## The pieces

One repository, one folder per service:

- `sso`, the auth server: Rails 8.1, [Devise](https://github.com/heartcombo/devise) for users and passwords, [Doorkeeper](https://github.com/doorkeeper-gem/doorkeeper) for OAuth 2, [doorkeeper-openid_connect](https://github.com/doorkeeper-gem/doorkeeper-openid_connect) for OpenID Connect. Google is a button on its login page.
- `api`, the app's backend, in Rails 8.1. It logs browsers in, knows what each person may do, and holds their data.
- `web`, the Vue front end.
- the Python API, the second service.

![The four pieces and how they talk to each other](pieces-en.png "Dashed means not built yet: the Python API and its calls.")

They share no database and no code, and talk only over HTTP. The browser sends `api` a cookie and nothing else. `api` calls the SSO to trade a login code for tokens, to renew them, to revoke them at logout, and to fetch its public keys. Nobody asks the SSO whether a token or a session is still good.

| Job | Who does it |
| --- | --- |
| Know who the person is: email, password, Google account | `sso`, in its own database |
| Issue tokens, publish the public keys that check them | `sso`, through Doorkeeper |
| Log a browser in and remember it | `api`, with a row of its `browser_sessions` table |
| Decide what a user may do, hold their data | `api`, in its own database |
| Check that a token is genuine | each API, by itself |

The app trusts the SSO and nothing else. Google sits behind it, so adding another provider, or a customer's own, only changes the SSO. We built it in Rails because that's what we write most, and a Rails team can maintain it. [Better Auth](https://www.better-auth.com/) (Node) was considered: less code, but a second stack.

`api` also serves a back-office under `/admin` ([Administrate](https://github.com/thoughtbot/administrate) and Sidekiq's page). It logs in at the same SSO as a second client, and keeps its own cookie, limited to `/admin`. The two logins share no cookie, and ending one doesn't end the other. Being logged in isn't enough to get in: the user's `admin` column must be true in `api`'s database. Roles belong to the app, not to the SSO.

## Five things that are easy to confuse

A token is a string that proves something to whoever checks it. There are five such proofs here, and each one proves a different thing to a different party. They keep the same colour in every figure.

| | What it proves | Who holds it, who reads it | Lasts |
| --- | --- | --- | --- |
| **App session cookie** (pink) | This browser has a login in progress. It only holds the id of a `browser_sessions` row. | The browser holds it and only sends it under `/api`. `api` reads it. | 12 hours from the login |
| **SSO cookies** (purple) | This browser already logged in at the SSO. | The browser only sends them to the SSO. | Until the browser closes, and 30 days for the remember cookie |
| **Access token** (blue) | The SSO vouches that whoever carries it acts for this user, at these APIs. | `api` holds it. The page gets a copy when it asks. The APIs read it. | 15 minutes |
| **Refresh token** (orange) | "I was given the last tokens, give me the next ones." | `api` holds it, it never reaches the browser. The SSO reads it. | One use, and never more than 30 days after the login |
| **ID token** (teal) | The SSO says this person just logged in. It's what OpenID Connect adds. | `api` holds it and hands it back to the SSO at logout. No API accepts it. | 2 minutes |

The access token is a *bearer* token: an API accepts whoever presents it, and only checks that the token is genuine. That's why it's short-lived. The refresh token only works together with `api`'s secret, which the browser doesn't have.

The access token is a JWT, a small JSON document anyone can read, followed by a signature. Its fields say who signed it (`iss`, the SSO), for which user (`sub`, their id at the SSO, and their `email`), for which APIs (`aud`, which names both) and until when (`exp`). It carries no role and no scope: there is one client, it's ours, and `aud` already says which APIs the token is for.

## Login, step by step

The protocol is OAuth 2, the standard way for an app to send a user to a separate server to log in and get tokens back. The flow is called *authorization code*: the browser comes back from the SSO with a one-time code, and `api` trades that code for tokens, server to server. The password is only typed on the SSO's page, or on Google's, and no token reaches the browser during the login. In OAuth's terms, `api` is the *client*.

![The login of a browser, in 10 steps](login-en.png "Steps 3 and 5 are redirects the browser follows. Steps 6 and 7 never touch the browser.")

Each piece of the figure stops one specific attack.

| Piece | What it is | What it stops |
| --- | --- | --- |
| `state` (steps 2 to 5) | A random value `api` sends in step 3 and expects back in step 5. The pending login waits 10 minutes in a cookie named after it. | Another site making your browser finish a login it never started, into the attacker's account. |
| Client secret (step 6) | Sent by `api` to the SSO, never through the browser. | Anyone who intercepted a code trading it for tokens. |
| [PKCE](https://www.rfc-editor.org/rfc/rfc7636) (steps 3 and 6) | `api` keeps a random `code_verifier` and sends its SHA-256 hash, the `code_challenge`, in step 3. In step 6 the SSO hashes the verifier and compares. Doorkeeper accepts a variant with no hashing by default: the config keeps S256 only. | A stolen code being replayed in another browser. |
| Registered redirect address (step 5) | The SSO only sends codes to `/api/auth/callback`, and a code works once. | A crafted link delivering the code to another site. |
| `SameSite` (steps 5 and 9) | The pending-login cookie is `Lax`, so it's sent on the return from the SSO, which comes from another site. The session cookie is `Strict`, never sent on a request that starts from another site. | A link from another site reaching `api` with the session. |

Every page needs a user, so there's no "Sign in" button. Before a page is drawn, `web`'s router calls `GET /api/me` and starts the login on a 401. In step 4, if the SSO already knows the browser through its cookies, it shows nothing and answers with a code at once: the person only sees a spinner. That's what makes single sign-on "single", and why logout must also end the SSO's session.

With Google, the SSO runs the same round trip again in step 4, as Google's client this time. `api` sees no difference: it still receives tokens signed by the SSO, and Google's tokens never leave the SSO. A Google account is linked to an existing account only when Google says the email is verified, and it's found afterwards by Google's id, never by the email.

## How an API trusts a token without asking the SSO

The SSO signs every access token with an RSA private key (the RS256 algorithm). The matching public key can check a signature and can't produce one. So the APIs can be given the public key without being able to forge tokens.

The SSO publishes its public keys at `/oauth/discovery/keys`, each with an id, the `kid`, and each token names the key that signed it. `api` fetches the list on the first token and keeps it in memory. It only asks again when a token names a key it doesn't have, and at most once every 10 seconds. The rest of the time, checking a token is arithmetic done inside `api`, with no network call.

| Check | The question | What it stops |
| --- | --- | --- |
| Signature, RS256 only | Signed by the SSO key the `kid` names, and unchanged since? | Forged or edited tokens, and tokens that name a weaker algorithm |
| `iss` | Issued by our SSO? | Tokens from another server |
| `exp` | Still within its 15 minutes? | Old tokens, leaked ones included |
| `aud` | Is my name in the list? | Tokens meant for another API, and ID tokens, whose `aud` is the client's id |

With [ruby-jwt](https://github.com/jwt/ruby-jwt) it's one call. There are three traps, and each line closes one: `iss` and `aud` are only checked when asked for, a token with no `exp` at all passes, and the algorithm must be set by the API. If it were read from the token, a token signed with HS256 using the public key as the secret would be accepted, and everyone knows that key.

```ruby
claims, = JWT.decode(
  token, nil, true,
  jwks: self, # the SSO's key set, fetched once and kept in memory
  algorithm: "RS256",
  iss: sso.issuer, verify_iss: true,
  aud: sso.audience, verify_aud: true,
  required_claims: %w[exp sub]
)
```

A refused token gets a 401. If `api` has no keys and can't reach the SSO, it answers 503, because the token may be valid and the client should retry, not log in again. Then `api` finds its own user row by `sub`, or creates it on the first token. The SSO never tells `api` about a new user.

## Calling the Python API from the page

The Python API is on another origin, so the cookie never reaches it. The page asks `api` for an access token, keeps it in memory and sends it to the Python API, which then asks `api` for the user's data with the same token.

![The page gets a 15-minute token from api to call the Python API](jeton-court-en.png "Steps 1 to 3 are built. Steps 4 to 6 wait for the Python API.")

The safest design keeps every token on the server and has `api` relay the page's calls to the Python API. It doesn't hold here. The Python API streams long answers, and relaying them through Rails would occupy one server thread per open stream, with 3 threads configured. A reverse proxy in front of both services could do the relaying, but it was out of scope. [OAuth 2.0 for Browser-Based Applications](https://www.rfc-editor.org/rfc/rfc10017) (RFC 10017) calls this compromise a *token-mediating backend*, and allows it when relaying isn't possible.

- **The endpoint.** `POST /api/auth/token` answers `{ access_token, expires_in }`. While the stored token has more than a minute left, `api` hands it out as it is, with no call to the SSO.
- **Renewal under a lock.** A refresh token works once, and the SSO treats a second use as a theft (see below). So two requests must never renew at the same time. `api` takes a database lock, reads the row again, and renews only if that's still needed. The second request finds the token the first one stored. In Chrome, six requests sent at the same moment all got the same new token, and the SSO saw a single refresh.
- **What ends a login.** Only a 400 `invalid_grant` from the SSO, which means the refresh token itself is no good. `api` then deletes the row and answers 401, and the user logs in again. Any other failure, a slow or failing SSO, a wrong client secret, is a 503 and the session stays.
- **In the page.** A variable, never the browser's storage. The page counts from `expires_in` rather than from an absolute time, because its clock may not agree with the server's.

```ruby
def access_token!(sso_client)
  return [ access_token, access_token_expires_at ] if fresh?

  with_lock do
    update!(self.class.token_columns(sso_client.refresh(refresh_token))) unless fresh?
  end
  [ access_token, access_token_expires_at ]
rescue SsoClient::Refused
  destroy
  raise
end
```

## Staying logged in, and logging out

A login lasts 12 hours from the moment it was made, however much it's used. `api` checks that itself, on the age of the row. After 12 hours the next call gets a 401 and `web` starts the login again. If the SSO still knows the browser through its 30-day remember cookie, that's a few redirects and no form.

The browser adds cookies by itself, including to a request that another site's page makes it send. Three things protect the session against that. The cookie is `SameSite=Strict`. A request that isn't a GET and carries no token must name the app's origin in its `Origin` header, or it gets a 403. And no GET changes anything.

Logout is a form that posts to `/api/auth/logout`, and it closes three things.

| What it closes | How | If skipped |
| --- | --- | --- |
| The app session | `api` deletes the row, and the cookie names nothing. | The app keeps answering for up to 12 hours. |
| The refresh token | `api` asks the SSO to revoke it. If the SSO can't be told, logout goes on. | A refresh token nobody holds stays valid for up to 30 days. |
| The SSO session | `api` sends the browser to the SSO's `/oauth/logout` with the ID token it kept. The SSO ends its session and its remember cookie. | The next visit logs the user straight back in, with no password asked. |

An access token the page already holds works until it expires, 15 minutes at most.

Each renewal returns a new access token and a new refresh token, and the old refresh token stops working at that moment. That's rotation. The SSO adds two rules Doorkeeper doesn't have. If a used refresh token comes back, two parties hold it and the SSO can't tell which one is the thief, so it revokes every refresh token of that login and both have to log in again. And no refresh token works more than 30 days after its login, even if it was renewed the day before. This is the SSO's only custom controller, and it overrides no Doorkeeper method: it revokes the chain before Doorkeeper handles the request, and Doorkeeper then refuses it by itself.

```ruby
class TokensController < Doorkeeper::TokensController
  before_action :revoke_refresh_chain_if_reused_or_too_old, only: :create

  private

  def revoke_refresh_chain_if_reused_or_too_old
    return unless params[:grant_type] == "refresh_token"

    token = Doorkeeper::AccessToken.by_refresh_token(params[:refresh_token].to_s)
    return unless token
    # Only the token's own client, proven by its secret, can set the rules off.
    return unless server.client&.id == token.application_id

    reused = token.revoked?
    max_lifetime = Rails.application.config.x.refresh_token_max_lifetime
    too_old = token.login_at.nil? || token.login_at < max_lifetime.ago
    return unless reused || too_old

    Doorkeeper::AccessToken.where(
      resource_owner_id: token.resource_owner_id, application_id: token.application_id,
      login_at: token.login_at, revoked_at: nil
    ).update_all(revoked_at: Time.current)
  end
end
```

## Why not keep the tokens in the browser

That was our first design. The Vue app was an OAuth client like any other. It ran the login itself with [oidc-client-ts](https://github.com/authts/oidc-client-ts), kept its tokens in the tab's `sessionStorage`, refresh token included, and sent the access token as a Bearer to every API. The argument was uniformity: one mechanism for the browser today, a mobile app or a CLI tomorrow.

![Where the tokens live, in the first design and in the one we kept](avant-apres-en.png "In the first design a copied refresh token was worth 30 days. In the second, it never leaves api.")

It worked, but any script on the page can read `sessionStorage`, and a copied refresh token is worth up to 30 days of access. Rotation only catches the thief if the real app refreshes after them, so if the tab is closed, the stolen chain goes unnoticed until the end. OWASP's [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) and RFC 10017 point the same way: keep the tokens on a server, and give the browser only a cookie no script can read.

The price is that `api` now has two ways in, the cookie for browsers and the Bearer for other clients. The browser is no longer just another client.

## What local development taught us

Some problems only show up once the pieces run on different origins.

- Google refuses a redirect address on `sso.localhost`, because it must end with a public domain, and over plain http it only accepts `localhost`. So the SSO runs on `localhost:3000`.
- Cookies ignore ports. Opened on `localhost:3001`, the back-office would have received the SSO's cookies, and the SSO its. It runs on `app.localhost:3001`, another host.
- Behind Vite's proxy, `api` sees its own host, `localhost:3001`, and a redirect to a bare path sent the browser off the app. `api` now builds its addresses from the app's configured origin.
- With an SSO session open, a login is a chain of redirects with nothing to stop it, so any failure that restarts it loops forever. A failed login ends on a page that starts nothing, and the front refuses to log in twice within 30 seconds.
- Devise only forgets a user it finds in the session at logout. After the browser was closed the session is empty, and the remember cookie survived every logout. The logout controllers now load the user from that cookie before signing out.

## The risks we accepted

- **A script on the page can read an access token.** It can read neither the cookie nor the refresh token, but it can ask `api` for an access token, which works for 15 minutes at both APIs. In the first design it was 30 days. No content security policy is set up yet.
- **Revocation is slow.** A user disabled at the SSO keeps access from a browser for up to 12 hours, and with a token for up to 15 minutes.
- **One token works at both APIs.** A leak at one works at the other. A token per API needs resource indicators ([RFC 8707](https://www.rfc-editor.org/rfc/rfc8707)), which Doorkeeper only has in its 6.0 release candidate.
- **No "log out everywhere".** Logout ends one login, not the others.
- **The browser is remembered.** Anyone using the same browser within 30 days is logged in without a password, and there's no checkbox to opt out on a shared computer.
- **The tokens are in `api`'s database**, stored as received. The refresh token is worth nothing without the client secret, which isn't in the database.

It all still runs locally, on SQLite and plain http, tried in Chrome only, with the Google login tested in OmniAuth's test mode and not against the real Google. There's no sign-up, password reset, company SSO or two-factor yet. And the Python API isn't merged: the design is proven up to the token it will receive.
