# Dominions 5 Server Manager

This is a web-based server manager, capable of running, managing and monitoring multiple servers.

## RUNNING

| command | description |
| ------- | ----------- |
`npm run dev` | Run the server in development mode. WILL NOT MONITOR THE `server` FOLDER FOR CHANGES, ONLY `website`
`npm run watch` | Run the server in development mode, and watch the `server` folder for any changes. Useful for developing server features.
`npm run build` | Make a production build of the server and website. (Required before `npm run start`)
`npm run start` | Run the production version of the server and website. (Requires `npm run build` to be run first)

## WEBSITE
In the `site` folder, you have the website code.

| path | description |
| -----|-------------|
`site/pages` | Any file here, or in subdirectories, next.js will try to render and serve to the browser. To create a new page, all you need to do is create a new file and export something that renders a page (either a function or a component class).
`site/pages/api` | Files in here are special in that you don't render a website, but run API-calls.
`site/components` | Here you can place reusable (or bulky) components that you want to be able to reference from other files.
`site/styles` | SASS (`.scss`-files) is a superset of CSS, meaning everything in CSS works in SASS without modification, but if you wanna do something more complicated, you have access to nice things.
`site/utils` | Helper functions for various tasks, often things that gets done a lot or would take up too much space in a component/page file

## SERVER

| path | description |
| -----|-------------|
`server/manager` | Here is the actual servermanager code, which should like, read databases, keep servers running, have methods to get the status of an instance, have methods to act on the server instances, etc.
`server/Dom5` | Linn's responsibility. Helper stuff to talk to the dominions5 executable.
`server/upnp.ts` | Linn's responsibility. Magical UPNP code that lets you automatically port-forward on supported devices!
`server/base.ts` | Linn's responsibility. Blob of code to set up next.js and inject the environment.
`server/index.ts` | Linn's responsibility. The startup file that, when you run it, starts the server.
