var cssParse = require("css-parse"),
    extend = require("extend"),
    isUrl = require("./url.js");

module.exports = function(content, options) {

  var lines = content.split(/\r?\n/g),
      warnings = [];

  options = extend({ lineNumbers: true }, options);

  lines.forEach(function(line, i){

    var matches = line.match(isUrl);

    (matches || []).forEach(function(match){

      match = { url: match };

      if (options.lineNumbers) {
        match.line = i + 1;
      }

      warnings.push(match);

    });

  });

  return warnings;

};
