// Abstract this out as well to handle various styles of routing actions/generating paths
JazzFusion.Router = {
  resolve: function(params) {
    if(JazzFusion.getType(params) === "string")
      return this.resolvePath(params);
    params = JazzFusion.merge({
      controller: "main",
      action: "index"
    }, params);
    
    JazzFusion.params = params;
    
    if(JazzFusion.controllers.get(params.controller))
      if(JazzFusion.controllers.get(params.controller)[params.action])
        return JazzFusion.controllers.get(params.controller)[params.action];
    return false;
  },
  resolvePath: function(path) {
    path = path.replace(JazzFusion.baseHref, '');
    var fragments = path.replace(/(\/|\?)/g, "##").split("##");
    var params = {
      controller: fragments[0],
      action: fragments[1] || "index"
    };
    if(fragments[2])
      JazzFusion.each(fragments[2].split("&"), function(frag) {
        var nameAndVal = frag.split("=");
        params[nameAndVal[0]] = nameAndVal[1];
      });
    
    return this.resolve(params);
  },
  run: function(params) {
    var action = this.resolve(params);
    if(action) {
      action.run();
    }
  }
};