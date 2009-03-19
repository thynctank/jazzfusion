// Abstract this out as well to handle various styles of routing actions/generating paths
JazzFusion.router = {
  resolve: function(options) {
    var routeOptions = JazzFusion.merge({
      controller: "",
      action: "index",
      params: {}
    }, options);
    if(!routeOptions.controller)
      throw("A route MUST include a controller at a minimum");
    
    var controller = JazzFusion.controllers.get(routeOptions.controller);
    if(!controller)
      throw("Controller not found");
    else {
      if(!(controller[routeOptions.action] && controller[routeOptions.action].run && JazzFusion.getType(controller[routeOptions.action].run) === "function"))
        throw("Action not found");
      else
        controller[routeOptions.action].run(routeOptions.params);
    }
  },
  resolvePath: function(path) {
    // break up path string into components, lookup in controllers hash and call appropriate action, passing in any params
    // example path: test/index?key=val&key2=val2
    // resolves to: testController.options.actions.index({key: val, key2: val2});
  },
  generatePath: function(controller, action, params) {
    // build path string from components
    // example params: testController, "index", {key: val, key2: val2}
    // generates: test/index?key=val&key2=val2
  }
};