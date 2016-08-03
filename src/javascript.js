var esprima = require("esprima"),
    extend = require("extend"),
    isUrl = require("./url.js");

module.exports = function(content, options) {

  options = extend({ lineNumbers: true }, options);

  var nodes = esprima.tokenize(content,{
        tolerant: !!options.silent,
        loc: true
      }),
      warnings = [];

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
