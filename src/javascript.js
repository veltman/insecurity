var esprima = require("esprima"),
    extend = require("extend"),
    isUrl = require("./url.js");

module.exports = function(content, options) {

  var nodes = esprima.tokenize(content, { loc: true }),
      warnings = [];

  options = extend({ lineNumbers: true }, options);

  nodes.forEach(function(node) {

    var matches;

    if (node.type === "String" && (matches = node.value.match(isUrl))) {

      matches.forEach(function(match){
        match = { url: match };

        if (options.lineNumbers) {
          match.line = node.loc.start.line;
        }

        warnings.push(match);

      });

    }

  });

  return warnings;

};
