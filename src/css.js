var parseCSS = require("css-parse"),
    extend = require("extend"),
    isUrl = require("./url.js");

module.exports = function(content, options) {

  var warnings = [];

  options = extend({ lineNumbers: true }, options);

  traverse(parseCSS(content, { silent: !!options.silent }), function(node){

    var matches;

    if (node.type === "declaration" && (matches = node.value.match(isUrl))) {

      matches.forEach(function(match){
        match = { url: match.replace(/\)$/, ""), property: node.property };

        if (options.lineNumbers) {
          match.line = node.position.start.line;
        }

        warnings.push(match);

      });

    }

  });

  return warnings;

};

function traverse(node, onNode) {

  onNode(node);

  if (node.type === "stylesheet") {
    traverse(node.stylesheet, onNode);
  } else {
    (node.rules || node.declarations || []).forEach(function(child){
      traverse(child, onNode);
    });
  }

}
