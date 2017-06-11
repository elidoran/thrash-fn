## simple example

* [fn.js](fn.js) shows a simple function we'll "thrash"
* [index.js](index.js) shows how we use thrash
* [inputs](inputs) are some example input files

Run the example from the root of this repo:

```sh
node example/index.js

# or, enable TurboFan so the baddy slice() calls optimized
node --turbo example/index.js
```
