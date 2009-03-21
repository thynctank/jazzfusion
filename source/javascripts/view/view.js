// This is an adapter for various parsers.
// Abstract into various parsers for simple templates, markdown, etc
JazzFusion.View = function() {
  this.hasRendered = false;
};

//   Within template you can call helpers as JazzFusion.currentAction.helper_method_name() in embedded JS
//   First just allow substitution and simple parameterless function calls

JazzFusion.View.prototype = {
  render: function(options) {
    this.source = JazzFusion.Router.fetchTemplate();
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
    JazzFusion.View.hijack();
  }
};

JazzFusion.View.hijack = function() {
  // hijack links - ignore those designated remote
  // hijack forms - ignore those designated remote
};