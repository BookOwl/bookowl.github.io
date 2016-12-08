---
layout: post
title: "Rusty (Markov) Chains"
tags: "rust markov text generation n-grams"
---

In this article we are going to create a Rust project that generates real looking but random text using Markov chains.

You can find the finished code [on Github](https://github.com/BookOwl/rusty-markov).

## What is a Markov chain?
According to Wikipedia, a Markov chain is

> a stochastic process that satisfies the Markov property (usually characterized as "memorylessness").

Um, OK, that helped _a lot_. Let's try a different approach. Look at the following diagram:

![Diagram of a simple Markov chain](/assets/images/markovkate_01.svg)

<i>By Joxemai4 - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=10284158</i>

Let's say that we start at the A state. The diagram says that we have a 60% chance of staying at the A state and a 40% chance of moving to the E state. Let's ask Python where we should go:

{% highlight python %}
>>> from random import random
>>> def move_from_A(): return "A" if random() < 0.6 else "E"
>>> move_from_A()
'A'
{% endhighlight %}

Ok, we are staying at A.

{% highlight python %}
>>> move_from_A()
'E'
{% endhighlight %}

Now we are moving to E. The diagram says that we have a 30% chance of staying at E and a 70% chance of moving back to A. Let's write a function to decide where we should go from here:

{% highlight python %}
>>> def move_from_E(): return "A" if random() < 0.7 else "E"
{% endhighlight %}

Now let's find out where we are going:
{% highlight python %}
>>> move_from_E()
'E'
>>> move_from_E()
'A'
>>> move_from_A()
'E'
>>> move_from_E()
'A'
>>> move_from_A()
'A'
>>> move_from_A()
'E'
{% endhighlight %}

I think that's enough moves for now. What we just did is generate the string AAEEAEAAE by using a Markov chain. Let's look back at that Wikipedia definition again:

> a stochastic process that satisfies the Markov property (usually characterized as "memorylessness").

"Stochastic" just means that the process is random. Our experiment showed that we were able to find out what the next item in the chain was just by knowing what the current item was. This is the Markov property in a nutshell. If we put it all together, we get that a Markov chain is the result of running a random process that satisfies the property that we can predict the next result of the process just by knowing the current result, and no amount of prior results will help us make a better prediction.

Now let's find out how we can use Markov chains to generate text.

## n-grams
There is one more thing that we need to learn about before we can start creating our book writing bot, and that is n-grams. Luckily, they are easier to understand than Markov chains. The Wikipedia definition is excellent:

> an n-gram is a contiguous sequence of n items from a corpus (a given sequence of text or speech).

For example, if we had the sentence "I like to have pizza and ice cream for dinner", "I like", "like to", "to have", "have pizza", "pizza and", "and ice", "ice cream", "cream for", and "for dinner." are all 2-grams from that sentence. (Actually, they are all the 2-grams). We can also have 3-grams and 4-grams, or any positive number for n, but 2 and 3 seem to be the most common.

## Let's write some code!
Now that we got all that theory out of the way, we can start coding. First make sure that you've installed [Rust](https://www.rust-lang.org/) correctly by running the following command in your terminal

{% highlight bash %}
$ rustc --version
{% endhighlight %}

If it outputs something like `rustc 1.13.0`, than you should be good to go. Otherwise, follow [these instructions](https://www.rustup.rs/) to install Rust and Cargo.

If you haven't already, open up a terminal and `cd` to wherever you want to keep your project. Then run `cargo new --bin markov` to create a new Rust project in a folder named markov. This will also be the name of our binary. Now `cd` into the newly created markov directory.

{% highlight bash %}
$ cd where/you/want/to/keep/the/code
$ cargo new --bin markov
$ cd markov
{% endhighlight %}

Cargo will also create a new git repository in the project folder, so if you want to use it you should probably create a "Created project" commit.

{% highlight bash %}
$ git add *
$ git add .gitignore
$ git commit -m "Created project"
{% endhighlight %}

Finally, open your favorite editor and open up the markov folder as a project.

### Where are my crates?

We are going to need a couple crates for this project, so let's open up `Cargo.toml` and add them. When you first open up `Cargo.toml`, it should look like this:
{% highlight toml %}
[package]
name = "markov"
version = "0.1.0"
authors = ["BookOwl <stanleybookowl@gmail.com>"]

[dependencies]
{% endhighlight %}

We need to add the following two lines to the end of the file (right after `[dependencies]`):
{% highlight toml %}
rand = "0.3"
clap = "~2.19.0"
{% endhighlight %}

This will add the rand and clap crates to our project, which we will need for generating random numbers and for parsing command line arguments.

### Parsing the arguments.

Now we are going to create the parser for the command line arguments. Open up `src/main.rs`, delete everything in it, and add the following code:

{% highlight rust%}
#[macro_use]
extern crate clap;

fn main() {
    // Create the argument parser and parse the args
    let matches = clap_app!(markov =>
        (version: "1.0")
        (author: "Matthew S. <stanleybookowl@gmail.com>")
        (about: "Generates random text using a Markov chain")
        (@arg CORPUS: +required "Sets the text corpus to use")
        (@arg SENTENCES: -s --sentences +takes_value "Sets how many sentences to generate")
        (@arg WORDS: -w --words +takes_value "Sets how many words to generate")
    ).get_matches();

    // Get the values of the corpus, sentences, and words arguments/
    let path = matches.value_of("CORPUS").unwrap();
    let sentences: u32 = matches.value_of("SENTENCES").map(|n| n.parse().unwrap()).unwrap_or(0);
    let words: u32 = matches.value_of("WORDS").map(|n| n.parse().unwrap()).unwrap_or(0);

    // If the user didn't pass a value for sentences or words...
    if sentences == 0 && words == 0 {
        // ... print an error message and return
        println!("You must pass an argument for either --sentences or --words");
        return
    }

    // If the user passed a value for sentences, we will generate sentences.
    // Otherwise we will generate words
    let generating_sentences = sentences > 0;
}
{% endhighlight%}
(of course you should replace my name and email with yours)

Let's also add a `println!` call so that we can test that the code is working properly:
{% highlight rust %}
println!("corpus file:\t{}\nsentences:\t{}\nwords:\t{}\ngenerating sentences?\t{}",
             corpus_file, sentences, words, generating_sentences);
{% endhighlight %}

Now let's try to build and run our project:
{% highlight bash %}
$ cargo build
$ ./target/debug/markov corpus.txt -w 5 -s 10
corpus file:	corpus.txt
sentences:	10
words:	5
generating sentences?	true
{% endhighlight %}

If you got the above output, then you are good to go on, otherwise double check that you have entered in the above code exactly.

### Reading the corpus file

Now let's move on to reading the corpus file. First, we need to import some standard library modules that have to do with io and files. Stick the following code after the `extern crate clap` line:

{% highlight rust %}
use std::io;
use std::io::prelude::*;
use std::fs::File;
{% endhighlight %}
<span style="display: none;">*</span>

This code imports the io module, and brings everything in the io::prelude module plus File from fs::file into the current scope. Now we can write our file reading function:

{% highlight rust %}
/// Reads a file and returns the contents as an io::Result<String>
fn read_file(path: &str) -> io::Result<String> {
    // Try to open the file
    let mut f = try!(File::open(path));
    // Create a new string to read the file's contents into
    let mut s = String::new();
    // Try to read the file's contents into s
    try!(f.read_to_string(&mut s));
    // Everything was OK, so return an Ok<String> with the file's contents
    Ok(s)
}
{% endhighlight %}

We return the contents of the file as a io::Result to make error handling easier by letting us use the [try! macro](https://doc.rust-lang.org/book/error-handling.html#the-try-macro). This macro automatically handles errors and early returns for us.

Now let's add some code to the main function to use our shiny new `read_file` function:

{% highlight rust %}
// read the corpus file and assign it to corpus.
let corpus = match read_file(path) {
    Ok(s) => s,
    Err(e) => {
        println!("Error reading corpus file {:?}: {}", path, e);
        return
    }
};

println!("Corpus: {:?}", corpus);
{% endhighlight %}

Pretty simple stuff. We pattern match on the result of the read_file function. If it is `Ok` we just assign the file contents to corpus, but if it is `Err` we print an error message and exit.

Try building and running the project again to make sure that reads a corpus file correctly and also gracefully exits if there is a problem opening and reading a file.

### Generating bigrams

We've gotten to the point of generating bigrams. Let's create a new function to do that:

{% highlight rust %}
/// Returns a HashMap with all the bigrams generated from the corpus
fn generate_bigrams(corpus: &str) -> Bigrams {
    // Create a HashMap to store the bigrams in
    let mut bigrams = HashMap::new();
    // Create a Vec of words from the corpus by splitting on whitespace
    let words: Vec<_> = corpus.split_whitespace().collect();
    // Iterate over the words and their indexes
    for (i, word1) in words.iter().enumerate() {
        // If we have gotten too far in the vector...
        if i + 2 >= words.len() {
            // ...break out of the loop
            break
        }
        // Get the next two words following word1
        let (word2, word3) = (words[i+1], words[i+2]);
        // If there isn't already an entry for the bigram (word1, word2),
        // create it with a new Vec for it's value and return that vec.
        // Otherwise, we get the Vec that is aleady associated with the bigram.
        (*bigrams.entry((*word1, word2)).or_insert(Vec::new()))
        // Now we take that Vec and push word3 into it.
        .push(word3);
    }
    // Return the bigrams
    bigrams
}
{% endhighlight %}
<span style="display: none;">_</span>

Before we can use this code, we need to import HashMap and define the Bigram type. I'm just using a HashMap of tuples and vectors to be simple.

{% highlight rust %}
use std::collections::HashMap;

// Create a type allias for Bigrams so that we don't have to keep retyping the long type.
type Bigrams<'a> = HashMap<(&'a str, &'a str), Vec<&'a str>>;
{% endhighlight %}

While that type looks complicated, it's actually quite simple. A `Bigram` is just a `HashMap` with keys of type `(&'a str, &'a str)` (a tuple of two str references that have a lifetime of a) and keys of type `Vec<&'a str>` (a vector of str references that also have a lifetime of a).

[The Book](https://doc.rust-lang.org/book/lifetimes.html) has a great intro to lifetimes if you haven't encountered them before.

We need to add some more code to the main function to make use of the bigram generator:

{% highlight rust %}
let bigrams = generate_bigrams(&corpus);

println!("Bigrams: {:?}", bigrams);
{% endhighlight %}

In order to test our code, we need a real corpus to work with. I'm using the following small corpus to test out the code:

{% highlight bf %}
The quick brown fox jumped over the lazy dog.
I love to eat pizza and ice cream for dinner.
Do you like to eat pizza?
{% endhighlight%}

Save that in a file named corpus.txt, and run the following commands:

{% highlight bash %}
$ cargo build
$ ./target/debug/markov corpus.txt -s 5
{% endhighlight %}

You should get the following output:

{% highlight rust %}
corpus file:	corpus.txt
sentences:	0
words:	5
generating sentences?	false
Corpus: "The quick brown fox jumped over the lazy dog.\nI love to eat pizza and icecream for dinner.\nDo you like to eat pizza?\n"
Bigrams: {("to", "eat"): ["pizza", "pizza?"], ("quick", "brown"): ["fox"], ("and", "icecream"): ["for"], ("over", "the"): ["lazy"], ("for", "dinner."): ["Do"], ("dinner.", "Do"): ["you"], ("you", "like"): ["to"], ("icecream", "for"): ["dinner."], ("brown", "fox"): ["jumped"], ("love", "to"): ["eat"], ("the", "lazy"): ["dog."], ("I", "love"): ["to"], ("fox", "jumped"): ["over"], ("The", "quick"): ["brown"], ("dog.", "I"): ["love"], ("pizza", "and"): ["icecream"], ("Do", "you"): ["like"], ("lazy", "dog."): ["I"], ("eat", "pizza"): ["and"], ("like", "to"): ["eat"], ("jumped", "over"): ["the"]}
{% endhighlight %}

### Generating random words and sentences
We've finally gotten to the point of generating random words! 😀

We need to add the following extern and use to the top of our file:

{% highlight rust %}
// put this after "extern crate clap;"
extern crate rand;

// and put this after "use std::collections::HashMap;""
use rand::{thread_rng, Rng};
{% endhighlight %}

Now we can write our function for generating random words:

{% highlight rust %}
/// Generates a string of amount words from bigrams
fn generate_words<'a>(bigrams: &Bigrams, amount: u32) -> Result<String, &'a str> {
    // Pick a random bigram to start the string with and unpack it to first and second
    let (first, mut second) = **match thread_rng()
                                      .choose(&bigrams.keys().collect::<Vec<_>>()) {
        Some(v) => v,
        None => return Err("No starting words could be found")
    };
    // Create a new String to hold our sentence
    let mut s = String::new();
    // Push the first words
    s.push_str(first);
    s.push(' ');
    s.push_str(second);
    // The current bigram is (first, second)
    let mut current_bigram = (first, second);
    // next is the next word in the sentence.
    let mut next;
    // Generate amount-2 words
    for _ in 0..amount-2 {
        // Push a space to the sentence
        s.push(' ');
        // Get a list of words that can be next
        let nexts = match bigrams.get(&current_bigram) {
            Some(v) => v,
            None => return Err("Couldn't generate next word from bigram")
        };
        // Pick a random word to be next from nexts
        next = match thread_rng().choose(nexts) {
            Some(v) => v,
            None => return Err("No words could be found for next")
        };
        // Push the next word.
        s.push_str(next);
        // The current bigram is now (second, next)
        current_bigram = (second, next);
        // and second is now next
        second = next;
    }
    // We have finished generating the words, so return them inside an Ok
    Ok(s)
}
{% endhighlight %}
<span style="display:none">**</span>

Now let's generate random sentences. We'll start by creating a function that generates one random sentence. Its logic is much like `generate_words()`, but it has some special code to find words that start and end sentences in the corpus.

{% highlight rust %}
/// Generates a sentence from bigrams
fn generate_sentence<'a>(bigrams: &Bigrams) -> Result<String, &'a str> {
    // The characters that determine the end of a sentence
    let eos = ['.', '?', '!'];
    // The bigrams that can start a sentence are...
    let starters: Vec<_> = bigrams.keys()
    // ... the ones that have the first word of the bigram start with an uppercase letter
                           .filter(|&bigram| bigram.0.chars().nth(0).unwrap().is_uppercase())
                           .collect();
    // Pick a random bigram to start the sentence with and unpack it to first and second
    let (first, mut second) = **match thread_rng().choose(&starters) {
        Some(v) => v,
        None => return Err("No sentence starters could be found")
    };
    // Create a new String to hold our sentence
    let mut s = String::new();
    // Push the first words
    s.push_str(first);
    s.push(' ');
    s.push_str(second);
    // The current bigram is (first, second)
    let mut current_bigram = (first, second);
    // next is the next word in the sentence.
    let mut next;
    loop {
        // Push a space to the sentence
        s.push(' ');
        // Get a list of words that can be next
        let nexts = match bigrams.get(&current_bigram) {
            Some(v) => v,
            None => return Err("Couldn't generate next word from bigram")
        };
        // Pick a random word to be next from nexts
        next = match thread_rng().choose(nexts) {
            Some(v) => v,
            None => return Err("No words could be found for next")
        };
        // Push the next word.
        s.push_str(next);
        // If the next word ends the sentence...
        if eos.contains(&next.chars().last().unwrap()) {
            // ...then break
            break
        }
        // The current bigram is now (second, next)
        current_bigram = (second, next);
        // and second is now next
        second = next;
    }
    // We have finished generating the sentence, so return it inside an Ok
    Ok(s)
}
{% endhighlight %}
<span style="display:none">_</span>

We can use this function to easily create a function to generate multiple sentences:

{% highlight rust %}
/// Generate multiple sentences from bigrams
fn generate_sentences<'a>(bigrams: &Bigrams, amount: u32) -> Result<String, &'a str> {
    let mut s = String::new();
    // Push a new sentence to the string
    s.push_str(&try!(generate_sentence(&bigrams)));
    // Repeat amount-1 times
    for _ in 0..amount-1 {
        // Push a newline
        s.push("\n\n");
        // Push a new sentence to the string
        s.push_str(&try!(generate_sentence(&bigrams)));
    }
    Ok(s)
}
{% endhighlight %}

### Putting it all together
We can finally finish up our main function and have our finished app. First, remove all the `println!` calls (except for the error messages) from the main function, and then add in the following code at the end:

{% highlight rust %}
// If we are generating sentences...
if generating_sentences {
    // ...then print the generated sentences or an error message
    println!("{}", match generate_sentences(&bigrams, sentences) {
        Ok(s) => s,
        Err(e) => format!("Error: {}", e)
    })
} else {
    println!("{}", match generate_words(&bigrams, words) {
        Ok(s) => s,
        Err(e) => format!("Error: {}", e)
    });
}
{% endhighlight %}

Try building it with `cargo build` to make sure that there are no errors. Then build it again with `cargo build --release` to build an executable that runs much, much faster than the debug releases. [Project Gutenberg](http://www.gutenberg.org/) has many free, plain text ebooks that work perfectly as corpuses.

To close this article, I'll include some random sentences generated from [The Cat of Bubastes: A Tale of Ancient Egypt by G. A. Henty](http://www.gutenberg.org/ebooks/29756).

> Ameres. He was devoted to his disadvantage.

> Ruth looked the elder of the things you have.

> I understand now.

> God." "They are to stay here, my lord," Amuba answered; "but at the head and made a motion of the two.

> The shields had a weapon of some dangerous creature.

> On ceremonial occasions, as the slaying of the bales of goods were made in the search will be willing to admit that the battle in which Ameres was bold enough to see that we should find a ship to take the former had recovered to some seats placed beneath trees on the head had, to Amuba, a lad who was bleeding freely, was with Mysa at the point that was carrying them; but the completeness of the Roman connection with them, who was to dispose of the Rebu, where, indeed, even if the eldest son was, he was lifted out, carried into an orchard, and lie there with only your face that he is left to himself, but he thought it best that you were doing." Jethro then returned across the country.

> Amuba, let us land and run and fetch a hoe." Throwing down his merchandise by ship and start upon their flocks for the coast.

> I admit it is all I don't suppose we shall start exactly at sunrise.

> Have you heard aught in the afternoon when the two lads bowed respectfully to the state of change.

> Ameres," Jethro said.

### Credits

[This article](https://pythonadventures.wordpress.com/tag/text-generator/) really helped me to understand how text generation using Markov chains works, and it's code was the inspiration for the Rust code created in this post.

Wikipedia helped out with some definitions.

The Markov chain diagram was by Joxemai4 - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=10284158
