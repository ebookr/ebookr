ebookr
======

An e-book framework that aims to streamline building e-books in various formats.

The aim of this project is to create tools that ease and enhance the already powerful [Pandoc](http://johnmacfarlane.net/pandoc/). Two goals are prominent:

1. To streamline the creation of various ebook-formats from a given set of [Markdown](http://daringfireball.net/projects/markdown/) files
2. To facilitate extensions through a HTML-inspired interface

Setup
-----

1. Install Pandoc
2. Choose how to utilize ebookr
    * In your own code: ´npm install ebookr´
    * ~~From commandline: [grunt-ebookr](https://github.com/ebookr/ebookr-cli)~~ (not available yet)
    * ~~Using [Grunt](http://gruntjs.com/): [grunt-ebookr](https://github.com/ebookr/grunt-ebookr)~~ (not available yet)
3. Extend it with [extensions](https://github.com/ebookr/ebookr/wiki/Available_extensions)
4. Start using it!

Extension interface
-------------------

The interface of extensions is HTML-inspired, with tags and attributes.

    <closed-tag attr="value" />
    <open-tag attr1="value" attr2="value">Some text</open-tag>

Extensions are added as parsers (runs through text to read metadata) and renderers (converts it into whatever output is required). Although many of these things are already available as extensions to the [markdown parsed by Pandoc](http://johnmacfarlane.net/pandoc/README.html#pandocs-markdown), these extensions aim to deliver more HTML counterparts to popular [LaTeX packages](http://en.wikibooks.org/wiki/LaTeX/Package_Reference).

To learn more about creating your own extensions, read about the [Extensions API](https://github.com/ebookr/ebookr/wiki/Extensions-API).

Use it in your own code
-----------------------

Explanation to come! (Check out [the roadmap](https://github.com/ebookr/ebookr/wiki/Roadmap) in the meantime.)