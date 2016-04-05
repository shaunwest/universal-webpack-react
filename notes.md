TODO
====

* Think about file structure. Actions/reducers should be shared between client/server, I think...
* What are the differences between all of the devtool source map options?
* Chunking
* Make sass work without linking it externally

ISSUES
=====

Debugging
---------
* breakpoints seem to be real flaky when dealing with transpiled ES6
* devtool: '#cheap-module-source-map' seems to work best, though it looks like there's less flakyness
* when HMR happens, debugging needs to be done with the updated version of the module (which will have an id appended to the file)

