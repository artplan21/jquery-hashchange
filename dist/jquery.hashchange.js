/*
 *  jQuery Hashchange - v1.0.0
 *  A plugin which allows to bind callbacks to custom window.location.hash (uri fragment id) values.
 *  https://github.com/apopelo/jquery-hashchange
 *
 *  Made by Andrey Popelo
 *  Under MIT License
 */
;(function($) {
  var methods = {
    init: function(options) {
      var settings = $.extend({
        "hash"     : "",
        "onSet"    : function(){},
        "onRemove" : function(){}
      }, options);

      if (!settings.hash) {
        return this;
      }

      if (!settings.hash instanceof RegExp) {
        // see https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
        settings.hash = new RegExp("/^" + String(settings.hash).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + "$/g");
      }

      // bind to hashchange at first time and init global variables
      if (!$.hashchange) {
        $.hashchange = {};
        $.hashchange.hashs = [];
        $.hashchange.onSet = {};
        $.hashchange.onRemove = {};
        $.hashchange.prevHash = null;

        $.hashchange.listener = function() {
          var currentHash, onRemove, onSet, i;
          //console.log(window.location.hash, settings.hash.test(window.location.hash) ? '1' : '0');

          // if hash didn't change - do nothing
          if ($.hashchange.prevHash !== null && $.hashchange.prevHash.test(window.location.hash)) {
            return ;
          }

          for(i=0; i < $.hashchange.hashs.length; i++) {
            currentHash = $.hashchange.hashs[i];

            if (!currentHash.test(window.location.hash)) {
              continue;
            }

            onRemove = $.hashchange.onRemove[String($.hashchange.prevHash || "")];
            onSet = $.hashchange.onSet[String(currentHash)];

            if (onRemove) {
              onRemove(window.location.hash);
            }

            if (onSet) {
              onSet(window.location.hash);
            }

            $.hashchange.prevHash = currentHash;
          }

        };

        this.bind("hashchange", $.hashchange.listener);
      }

      $.hashchange.hashs.push(settings.hash);
      $.hashchange.onSet[String(settings.hash)] = settings.onSet;
      $.hashchange.onRemove[String(settings.hash)] = settings.onRemove;

      // fire hashchange if current hash equals given
      // and it is not already active
      if (settings.hash.test(String(window.location.hash)) &&
          ($.hashchange.prevHash === null || !$.hashchange.prevHash.test(window.location.hash))) {
        $.hashchange.listener();
      }

      return this;
    }
  };

  $.fn.hashchange = function(options) {
    // options array passed
    if (Object.prototype.toString.call(options) === "[object Array]") {
      for (var i = options.length - 1; i >= 0; i--) {
        methods.init.apply(this, [options[i]]);
      }
      return this;
    }
    // single option passed
    return methods.init.apply(this, arguments);
  };
})(jQuery);
