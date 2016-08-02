var tape = require("tape"),
    path = require("path"),
    insecurity = require("../"),
    fs = require("fs");

var html = fs.readFileSync(path.join(__dirname, "data/test.html"), "utf8"),
    js = fs.readFileSync(path.join(__dirname, "data/test.js"), "utf8"),
    css = fs.readFileSync(path.join(__dirname, "data/test.css"), "utf8"),
    csv = fs.readFileSync(path.join(__dirname, "data/test.csv"), "utf8"),
    json = fs.readFileSync(path.join(__dirname, "data/test.json"), "utf8");

tape("Text", function(test) {

  var found;

  found = insecurity.text(csv);

  test.deepEqual(found, [
    { url: "http://wario.info/", line: 3 },
    { url: "http://waluigi.biz", line: 5 }
  ]);

  found = insecurity.text(csv, { lineNumbers: false });

  test.deepEqual(found, [
    { url: "http://wario.info/" },
    { url: "http://waluigi.biz" }
  ]);

  found = insecurity.text(json);

  test.deepEqual(found, [
    { url: "http://www.wario.com/?x=5&y=6", line: 7 },
    { url: "http://www.wario.com/", line: 9 }
  ]);

  found = insecurity.text(json, { lineNumbers: false });

  test.deepEqual(found, [
    { url: "http://www.wario.com/?x=5&y=6" },
    { url: "http://www.wario.com/" }
  ]);

  test.end();

});

tape("JS", function(test) {

  var found;

  found = insecurity.js(js);

  test.deepEqual(found, [
    { url: "http://wario.info", line: 5 },
    { url: "http://wario.tv", line: 9 }
  ]);

  found = insecurity.js(js, { lineNumbers: false });

  test.deepEqual(found, [
    { url: "http://wario.info" },
    { url: "http://wario.tv" }
  ]);

  test.end();

});

tape("CSS", function(test) {

  var found;

  found = insecurity.css(css);

  test.deepEqual(found, [
    {
      url: "http://wario.info/bg1.png",
      property: "background",
      line: 12
    },
    {
      url: "http://wario.info/bg2.png",
      property: "background",
      line: 16
    },
    {
      url: "http://wario.info/bg2.png",
      property: "background-image",
      line: 20
    },
    {
      url: "http://wario.info/mustache.ttf",
      property: "font-face",
      line: 24
    },
    {
      url: "http://wario.info.mustache.cur",
      property: "cursor",
      line: 28
    }
  ]);

  found = insecurity.css(css, { lineNumbers: false });

  test.deepEqual(found, [
    {
      url: "http://wario.info/bg1.png",
      property: "background"
    },
    {
      url: "http://wario.info/bg2.png",
      property: "background"
    },
    {
      url: "http://wario.info/bg2.png",
      property: "background-image"
    },
    {
      url: "http://wario.info/mustache.ttf",
      property: "font-face"
    },
    {
      url: "http://wario.info.mustache.cur",
      property: "cursor"
    }
  ]);

  test.end();

});

tape("HTML", function(test) {

  var found;

  found = insecurity.html(html);

  found = insecurity.html(html, { passive: true });

  found = insecurity.html(html, { styles: true });

  found = insecurity.html(html, { scripts: true });

  test.end();

});
