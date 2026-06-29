# Cloudflare deployment notes for ZenithFit

## Current rollback status

The previous Edge Runtime change was reverted because this application is a Node.js
Next.js app that uses PostgreSQL through `pg` and local filesystem access for user
photos. Keep these routes in the Node.js runtime for the local/Node server build.

Use the normal production build for the Node server:

```bash
npm run build
npm run start
```

## Cloudflare Pages warning

Do **not** use this build command for the current app:

```bash
npx @cloudflare/next-on-pages@1
```

`@cloudflare/next-on-pages` only supports Next.js routes that can run in the Edge
runtime. This project has dynamic API routes and pages that import `pg` and, for
photo routes, `fs`/`path`. Forcing `export const runtime = 'edge'` makes
`next build` fail with missing Node modules such as `fs`, `path`, and `stream`.

## What works now

The current code is suitable for a Node.js host with PostgreSQL available, for
example a VPS, Render, Railway, Fly.io, or another Node server. Cloudflare can
still be used for DNS, proxying, SSL, and DDoS protection in front of that Node
server.

## If Cloudflare hosting is required

For a real Cloudflare-hosted full-stack deployment, migrate the app instead of
forcing Edge runtime:

1. Deploy Next.js with the Cloudflare OpenNext adapter on Cloudflare Workers.
2. Move PostgreSQL access away from local `localhost` connections to a
   Cloudflare-compatible external database setup, for example Hyperdrive or a
   supported hosted PostgreSQL connection.
3. Replace local user photo writes/reads with Cloudflare R2 or another object
   storage service.
4. Only after those migrations, test a Cloudflare build and deployment.

Until those migrations are done, the reliable deployment path is Node.js hosting
plus Cloudflare DNS/proxy, not Cloudflare Pages with `next-on-pages`.
