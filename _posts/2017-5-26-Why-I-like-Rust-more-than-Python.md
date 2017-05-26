---
layout: post
title: Why I like Rust better than Python
tags: "rust python"
---

As many of you know, I've recently become infatuated with Rust and have started using it much more than Python, which used to be my favorite language. I have decided to create a list of reasons why I've switched.

1. Rust makes it much easier to distribute programs.
This was always one of my biggest grippes about Python. To distribute a Python project you have to send them your source code, make sure your user is running the right version of Python, and make sure that all the libraries your program needs are installed. With Rust, all you have to do is run `cargo build --release` and you have a simple binary that you can send to users.

2. Rust has a better package manager and project support.
Somewhat related to #1, Python has long suffered from lack of a good default package manager. Pip has come a long way, but creating a project that has its own set of packages and providing a way for other developers to reproduce your environment is still hard compared to other languages. In contrast, Rust comes with the Cargo package manager, which makes it easy to add packages (just add a line to `Cargo.toml`), allow other developers to exactly replicate your build (share `Cargo.lock`), and make sure projects don't step on each other's toes (each project gets its own copy of packages). Cargo also makes it very easy to publish packages (called "crates") to crates.io, Cargo's package repository.

3. Rust has algebraic data types and powerful pattern matching.
[Algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type) (or ADTs) are a powerful way to structure data that are normally found only in functional languages like Haskell or ML. I'm planning on writing a post on them soon, so I won't be spending much time on them here, but suffice it to say ADTs and pattern matching are much simpler and easy to use for my style of programming than Python's classes.

4. Rust has a much faster release cycle while still preserving backwards compatibility
Compared to Python's one and a half years between major releases, Rust releases a new version every six weeks. This would actually be a pretty big downside except for the fact that not too much is added in a single release and every release is 100% backwards compatible with every version back to 1.0 which means that every library released since then will just work. Because Rust is compiled, you don't have to worry as much about using new features because only you and not every single one of your users have to upgrade to the new Rust compiler.


5. Rust is fast. Like really, really fast.
Coming from an interpreted language like Python, Rust is extremely fast. It is almost as fast as C/C++, but it is still much easier to use.

6. Rust is statically typed with type inference.
My first experience with a statically typed language was with Java. That was such an awful experience compared to programming in Python that it really made me not want anything to do with static typing. Rust avoids the pitfalls that Java had by using type inference, which allows me to write my programs without having to think about types except for in function signatures and the bodies of structs and enums. I've actually found that writing out the type signatures of my functions and data types is very helpful in making me think about what my code should do without having to deal with all the `FooBar foobar = new FooBar();` junk. I've also had the static type checks tell me of more bugs than I care to admit.


Python still has some advantages over Rust, like having a ton more libraries and being much easier to learn, but for what I program, Rust is a better fit.