var cheerio = require("cheerio"),
    extend = require("extend"),
    js = require("./javascript.js"),
    css = require("./css.js"),
    isUrl = require("./url.js");

module.exports = function(content, options) {

  var $ = cheerio.load(content),
      warnings = [];

  options = extend({
    lineNumbers: true,
    styles: false,
    scripts: false,
    passive: false
  }, options);

  var selector = "script, link, iframe";

  if (options.styles) {
    selector += ", style";
  }

  if (options.passive) {
    selector += ", img, audio source, video source";
  }

  $(selector).each(function(){

    var $this = $(this),
        tag = this.tagName.toLowerCase(),
        attr = (tag === "link" ? $this.attr("href") : $this.attr("src")),
        matches;


    if (tag === "source") {
      tag = $this.parent().get(0).tagName.toLowerCase();
    }

    if (tag === "style") {
      css($this.text(), { lineNumbers: false }).forEach(function(match){
        match.tag = "style";
        match.inline = true;
        warnings.push(match);
      });
    } else {

      if (options.scripts && tag === "script" && (!$this.attr("type") || $this.attr("type") === "text/javascript")) {
        js($this.text(), { lineNumbers: false }).forEach(function(match){
          match.tag = "script";
          match.inline = true;
          warnings.push(match);
        });
      }

      if (typeof attr === "string" && (matches = attr.match(isUrl))) {
        matches.forEach(function(match){
          warnings.push({ url: match, tag: tag });
        });
      }

    }

  });

  return warnings;

};
