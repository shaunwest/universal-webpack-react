TODO
====

* Combine renderers into one
* Populate state from the backend db
* ~~Think about file structure. Actions/reducers should be shared between client/server, I think...~~
* What are the differences between all of the devtool source map options?
* Chunking
* ~~Make sass work without linking it externally~~
* Server-side-only routes should still use the index.html template
* ~~Mode flags (SSR, no spa, etc)~~
* Prod build
* Server stuff: crashing after a db error
* Webpack errors are too verbose on CLI

ISSUES
======

HMR
---
* Remember, making a change to a module just invalidates the cache. Subsequent changes won't invalidate until the module has been required again (maybe because a new request happened)

Rendering
---------
* Rich functionality will require javascript on the client side. 
  - For instance, while it may be possible to develop a word processing app as both a rich JS client and a functioning static site, it's probably not practical
  - Meaning, the main purpose of SSR is to make sure something is displayed, and is especially important when HTML is rendered by JS

Debugging
---------
* breakpoints seem to be real flaky when dealing with transpiled ES6
* devtool: '#cheap-module-source-map' seems to work best, though it looks like there's still some flakyness
* when HMR happens, debugging needs to be done with the updated version of the module (which will have an id appended to the file)

File Structure
--------------
* Server services: server-side calls to remote services
* Form services: server-side form post handling
* Server-only routes: routes that only exist on server (like what? 500 error?)

Ideals?
* All calls to services would not need to be routed through the server. 
  ie. They happen "universally" (either on client OR server depending on situation)

* Don't want to decache unnecessary files when a HMR is executed...
  which is why server reloads happen on a change in ./server
  and client reloads happen on a webpack change (./client)
  what about changes to shared code (actions/reducers)?
    currently those will get decached on a client change
      change reducer -> module reloads on client, but not server
        a full page reload would definitely get client/server in sync
        but before then, the server would theoretically be out of sync?
          so server services, server-only routes, form services would potentially be broken?
            **Current solution has been to combine server/client into one src dir**
