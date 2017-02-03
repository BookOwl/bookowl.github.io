---
layout: post
title: Rust to the Web
tags: "rust web"
---

Rust has recently gained support for compiling to asm.js and WASM via [emscripten](http://kripken.github.io/emscripten-site/index.html). This means that it is now possible to code in Rust and then deploy to a website! In this post I'll explain how you can do this yourself.

## Setting up your computer.
First of all, you need to make sure that you have all of emscripten's dependencies installed on your computer. You need [Node.js](https://nodejs.org/), [Python 2.x](https://www.python.org), Git, and [cmake](http://www.cmake.org/download/). On OS X, you also need to have the XCode Command Line Tools by installing XCode from the App Store, and then going to *XCode | Preferences | Downloads*, and install Command Line Tools. On Linux, you need to also have the build-essentials package installed.

**_A note for Windows users_**

You will still need to have Node and Python installed, but after you do that you should download and run an emcripten installer from [the downloads page](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html#windows). Now skip to the "Compiling to JS" section.

---

Now we can finally install emscripten! It can take a while to download and compile it, so I've create a bash script to do it:

<script src="https://gist.github.com/BookOwl/431ba90831b21cf0eef98d6cce97714d.js"></script>

Just save that script to your computer and run it with `sh rust-to-web.sh` and you should be good to go!

## Compiling to JS
We can now compile some Rust code to asm.js, which will work in the browser and in node.js. Create a new Rust binary project with `cargo new --bin rust-to-web` and cd into it. Edit `src/main.rs` to look like the following:
<script src="https://gist.github.com/BookOwl/708fe4f1d9410b0e89816cce70316f1c.js"></script>

Now run it with `cargo run` to make sure that you typed in the file properly. As long as you didn't get any errors we can now compile to JS code with `cargo build --target asmjs-unknown-emscripten` and then run the generated JS with `node target/asmjs-unknown-emscripten/debug/rust-to-web.js`. You should get `Hello, JS World!`


Congratulations! You've successfully compiled Rust to Javascript!

We can also use this Javascript in a webpage. To test this out, create the following HTML file:
<script src="https://gist.github.com/BookOwl/03b07886ef81123e0102eb6c3cfcb5c5.js"></script>
Copy the generated JS from `target/asmjs-unknown-emscripten/debug/rust-to-web.js` to the place where the HTML file is. Open the webpage in your browser and check the browser console. You should see the same output as in node.

That is all that we will go over in this short tutorial, but if you want to do more web stuff with Rust, please check out the links at the end of this post.

### Further resources

There are a lot more that you can do than just console.log when you compile Rust to asm.js, and the [webplatform crate](https://github.com/tcr/rust-webplatform) can help a lot with replacing JS with Rust.

@broson's [forum post](https://users.rust-lang.org/t/compiling-to-the-web-with-rust-and-emscripten/7627) helped a lot with figuring out how to get everything setup.

[This site](http://www.hellorust.com/emscripten/) has lots of examples of using Rust in the web.
