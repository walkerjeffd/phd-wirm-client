Web-based Interactive River Model (WIRM)
========================================
Jeffrey D. Walker

http://wirm.walkerjeff.com/

About
-----

WIRM is a client-side web application for simulating dissolved oxygen dynamics in rivers and streams. It demonstrates the use of modern web development practices for creating an interactive user interface for environmental simulation modeling.

WIRM is part of an ongoing research by PhD candidate Jeff Walker and Dr. Steve Chapra in the Dept of Civil and Environmental Engineering at Tufts University to investigate novel web-based approaches for environmental modeling and decision support.

This repository contains the JavaScript code to run the WIRM client application. The server code built using Django is currently not available.

Dependencies
------------
The WIRM client application requires the following JavaScript packages:

* [Twitter Bootstrap](http://twitter.github.io/bootstrap/)
* [jQuery](http://jquery.com)
* [jQuery-ui](http://jqueryui.com)
* [underscore.js](http://underscorejs.org)
* [modernizr.js](http://modernizr.com/)
* [backbone.js](http://backbonejs.orrg)
* [d3.js](http://d3js.org)
* [numeric.js](http://numericjs.com)
* [moment.js](http://momentjs.com)

Building Instructions
---------------------

The sources files are concatenated and minified using [grunt](http://gruntjs.com/). 

Grunt can be installed using the [node.js](http://nodejs.org/) package manager, [npm](https://npmjs.org/). First the grunt command line interface (grunt-cli) is installed globally. 

```shell
npm install -g grunt-cli
```

Then to install grunt and its local dependencies to the current folder, which reads the dependencies list in the package.json file:

```shell
npm install
```

Once grunt has been properly installed, simply run the grunt command to lint, concat, and minify the source code:

```shell
grunt
```

The output JavaScript files will be contained in the dist/ folder.

Caveat
------

Currently WIRM is designed to be used in association with the WIRM server, for which the code is currently not available. The server was built using Django and provides a REST API that is accessed by Backbone (using the django-rest-framework plugin). While templates for the Backbone view reside in the server code, they have been extracted and placed in the templates.html file for reference.

