var extend = require("extend");

function wrapper(fn) {

  return function(file, options) {

    options = extend({}, options);

    var warnings = fn(file, options);

    if (options.whitelist && (typeof options.whitelist === "string" || options.whitelist instanceof RegExp)) {
      options.whitelist = [options.whitelist];
    }

    if (options.whitelist) {
      warnings = warnings.filter(function(warning){

        return options.whitelist.every(function(wl){
          if (typeof wl === "string") {
            return warning.url.indexOf(wl) < 0;
          } else if (wl instanceof RegExp) {
            return !wl.test(warning.url);
          }
          return true;
        });

      });
    }

    return warnings;
  };
}

module.exports = {
  html: wrapper(require("./src/html.js")),
  css: wrapper(require("./src/css.js")),
  js: wrapper(require("./src/javascript.js")),
  text: wrapper(require("./src/text.js"))
};
