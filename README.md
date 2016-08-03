# Insecurity

[![Build Status](https://travis-ci.org/veltman/insecurity.svg?branch=master)](https://travis-ci.org/veltman/insecurity)

Analyze HTML, CSS, JS, etc. files for insecure URLs (`http://`) that might cause [Mixed Content problems](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#Mixed_passivedisplay_content) when serving a site over SSL.

## Installation

```sh
npm install insecurity
```

## Usage

All methods return an array of insecure urls found (or an empty array, if none are found).

### insecurity.html(content[, options])

Checks the `src` and `href` attributes of `<script>`, `<link>`, and `<iframe>` tags.

`content` is the text content of an HTML document.

If the `passive` option is set to true, it will also check the `src` attributes of `<img>`, `<audio>`, and `<video>` tags.

If the `styles` option is set to true, it will also check the properties in the inline contents of `<style>` tags for insecure `url()` values.

If the `scripts` option is set to true, it will also check the inline contents of any JS `<script>` tags for string literals that include insecure URLs.

You can also supply an array of strings and or regular expressions as a `whitelist` option. URLs that contain those strings or matches those expressions will be skipped.

Returns an array of insecure urls with a `url` and a `tag` name.

URLs found in the inline content of a `<script>` tag will also have `inline` set to `true`.

URLs found in the inline content of a `<script>` tag will also have `inline` set to `true` and a `property` name.

```js
var fs = require("fs"),
    insecurity = require("insecurity");

fs.readFile("something.html", "utf8", function(err, content){

  var problems = insecurity.html(content);

  /*
    [
      { tag: "link", url: "http://somethinginsecure.com/style.css" },
      { tag: "script", url: "http://somethinginsecure.com/script.js" }
    ]
  */

  problems = insecurity.html(content, { passive: true });

  /*
    [
      { tag: "link", url: "http://somethinginsecure.com/style.css" },
      { tag: "script", url: "http://somethinginsecure.com/script.js" },
      { tag: "img", url: "http://somethinginsecure.com/image.png" }
    ]
  */

  problems = insecurity.html(content, { passive: true, scripts: true, styles: true });

  /*
    [
      { tag: "link", url: "http://somethinginsecure.com/style.css" },
      { tag: "script", url: "http://somethinginsecure.com/script.js" },
      { tag: "img", url: "http://somethinginsecure.com/image.png" },
      { tag: "script", url: "http://somethinginsecure.com/inascript.html", inline: true },
      { tag: "style", url: "http://somethinginsecure.com/background-image.jpg", inline: true, property: "background" },
      { tag: "style", url: "http://somethinginsecure.com/Garamond.ttf", inline: true, property: "font-face" }
    ]
  */


});
```

### insecurity.css(content[, options])

Checks all `url()` values of CSS properties for insecure URLs.

`content` is the text content of a CSS stylesheet.

Returns an array of insecure urls with a `property`, a `url`, and a `line` number.  If the `lineNumbers` option is set to false, it will omit the `line` in the result.

You can also supply an array of strings and or regular expressions as a `whitelist` option. URLs that contain those strings or matches those expressions will be skipped.

If the `silent` option is set to true, it will not throw parsing errors.

```js
var fs = require("fs"),
    insecurity = require("insecurity");

fs.readFile("something.css", "utf8", function(err, content){

  var problems = insecurity.css(content);

  /*
    [
      { url: "http://somethinginsecure.com/img/background-image.png", property: "background-image", line: 10 },
      { url: "http://somethinginsecure.com/img/font.ttf", property: "src", line: 25 }
    ]
  */

});
```

### insecurity.js(content, options)

Checks all strings in a piece of JavaScript for any insecure URL string literals.

`content` is the text content of a JS file.

Returns an array of insecure urls with a a `url` and a `line` number.  If the `lineNumbers` option is set to false, it will omit the `line` in the result.

You can also supply an array of strings and or regular expressions as a `whitelist` option. URLs that contain those strings or matches those expressions will be skipped.

If the `silent` option is set to true, it will not throw parsing errors.

```js
var fs = require("fs"),
    insecurity = require("insecurity");

fs.readFile("something.js", "utf8", function(err, content){

  var problems = insecurity.js(content);

  /*
    [
      { url: "http://somethinginsecure.com/", line: 10 },
      { url: "http://somethingelseinsecure.com/", line: 25 }
    ]
  */

});
```

### insecurity.text(content, options)

Check any text for insecure URL substrings.

`content` is the text content.

Returns an array of insecure urls with a a `url` and a `line` number.  If the `lineNumbers` option is set to false, it will omit the `line` in the result.

You can also supply an array of strings and or regular expressions as a `whitelist` option. URLs that contain those strings or matches those expressions will be skipped.

```js
var fs = require("fs"),
    insecurity = require("insecurity");

fs.readFile("something.csv", "utf8", function(err, content){

  var problems = insecurity.text(content);

  /*
    [
      { url: "http://somethinginsecure.com/", line: 10 },
      { url: "http://somethingelseinsecure.com/whatever.html", line: 25 }
    ]
  */

});
```
