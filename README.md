# [ELA Platform Webapp](https://docs.google.com/presentation/d/191SGxjdiLePFHzSZyHJbOXER7wiJ_ubJ8gAPmltyQj8/edit?usp=sharing)

[![.github/workflows/pages-deployment.yml](https://github.com/cappscolton/ela-platform/actions/workflows/pages-deployment.yml/badge.svg)](https://github.com/cappscolton/ela-platform/actions/workflows/pages-deployment.yml)

## **Project Objectives**

### MVP

- [x] webapp has a basic UI
- [x] webapp commmunicates with LMS (Canvas) using the LTI Standard
- [x] webapp communicates with 1 external activity provider (Codio)
- [x] webapp provides the ability to switch between at least two assignment candidates for an ELA

### 1.0

- [ ] Webapp communicates with 2 or more external activity providers
- [x] Webapp stores and tracks individual student data gathered from ELA participation
- [x] Webapp has a teacher-only UI section
- [x] Platform provides a basic method of measuring Mastery Learning

### 2.0

- [x] Platform provides a research-backed method of measuring Mastery Learning
- [x] Webapp has a unifying interface, allowing easy integration of new ELA sets
- [ ] Webapp has a polished UI
- [ ] (Aborted) Webapp consistently determines equivalency between activities using metadata

&nbsp;

## **Install the dependencies**

```bash
npm install -g pnpm
pnpm install
pnpm install @prisma/client
```

&nbsp;

## **Server-based development setup**

You may use the node Dockerfile or examine its contents to see the commands to run for node. It is possible to also run a dev server (pnpm run dev) in place of "node build".

&nbsp;

## **Serverless-based development setup**

For a local "serverless" development environment emulating Cloudflare Pages, you can also set this in a .dev.vars file. The URL takes a different form here, using prisma's [data proxy](https://www.prisma.io/docs/data-platform/data-proxy). This points to the same database, but enables prisma to connect in an edge compute environment. Data proxy URL also works for the .env setup. For production serverless, this is set in the Cloudflare Pages interface.

```bash
DATABASE_URL="prisma://aws-us-east-1.prisma-data.com/?api_key=ABCDEFG"
```

Startup:

```bash
pnpm run build;
npx wrangler pages dev -- pnpm run dev;
```

&nbsp;

## **Prisma schema**

NoSQL DB won't enforce prisma.schema's constraints right away. Push those constraints to the DB with.

```bash
npx prisma db push
```

If using prisma data proxy, directUrl (raw DB driver connection string) must be provided in prisma.schema just for this function.

When the prisma.schema file is modified prisma client must be rebuilt.

```bash
npx prisma generate;
```

OR

```bash
npx prisma generate --data-proxy;
```

&nbsp;

## **Deploying**

### **Serverless**

Cloudflare Pages builds and deploys each commit to this repo.
[Setup](https://kit.svelte.dev/docs/adapter-cloudflare) takes 15 minutes. 100,000 free requests / day.

I use an alternative Github Actions setup. It does relatively the same thing while being freely readable.

Tail Prod logs with:

```bash
wrangler pages deployment tail --format json --project-name project-name
```

### **Server**

The Dockerfile is currently set to a Vite server which is not suitable for production. However, it does have the added benefit of HMR. It is probably possible to switch the CMD to "node build" for production if you can source all the variables from .env correctly.

This project does need to be hosted in order to communicate with LMS and Tool Providers. In development, I recommend using the Dockerfile then tunneling the application - but this will break some CSRF checks for the authentication setup. On a production server, you will just need to set up a domain.

Ensure you have all the necessary secrets and .env variables by filling in the .env.example file.

```bash
docker build ./;
docker run -p 127.0.0.1:80:5173 -it ela-node:latest;
ngrok http 5173;
```
