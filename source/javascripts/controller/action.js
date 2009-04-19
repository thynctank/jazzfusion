JazzFusion.BaseController.Action = function(name, controller, func) {
  this.controller = controller;
  this.func = func;
  if(this.controller.options.name)
    this.view = new JazzFusion.View(controller.options.name, name);
};

// actions must take view, controller, and params objects as params
JazzFusion.BaseController.Action.prototype = {
  run: function(params) {
    if(params)
      JazzFusion.currentParams = params;
    
    this.view.hasRendered = false;
    this.controller.beforeFilter();
    this.func(this.view, this.controller);
    this.view.render(JazzFusion.currentParams);
    this.controller.afterFilter();
  },
  redirectTo: function(options) {
    var routeOptions = JazzFusion.merge({
      controller: this.controller.options.name
    }, options);
    
    JazzFusion.router.resolve(routeOptions).run();
  },
  render: function(options) {
    this.view.render();
  }
};
