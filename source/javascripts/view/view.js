// This is an adapter for various parsers.
// Abstract into various parsers for simple templates, markdown, etc
JazzFusion.View = function() {
  this.source = "";
  this.hasRendered = false;
};

JazzFusion.View.prototype = {
  fetch: function() {
    this.source = $.ajax({
      async: false,
      url: "partial.html"
    }).responseText;
  },
  render: function(options) {
    this.fetch();
    if(this.hasRendered === true)
      return;

    this.hasRendered = true;
    JazzFusion.puts("Rendering");
    var html = JazzFusion.replaceAndClean(this.source, options);
    this.stripAndRunScripts(html);
  },
  stripAndRunScripts: function(html) {
    var scriptsRx = /<script.+<\/script>/g;
    var scripts = html.match(scriptsRx);
    html = html.replace(scriptsRx, "");
    
    var scriptRemovalRx = /<\/?script(\s*\S*=\S*)*>/g;
    JazzFusion.each(scripts, function(s) {
      // remove open/close script tags
      s = s.replace(scriptRemovalRx, "");
      // portions jacked from jQuery
      var head = document.getElementsByTagName("head")[0] || document.documentElement;
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.text = s;
      // insertBefore to head
      head.insertBefore(script, head.firstChild);
      // removeChild from head
      head.removeChild(script);
    });
    document.getElementById(JazzFusion.viewId).innerHTML = html;
  }
};