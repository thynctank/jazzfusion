//  actions are built into Action objects and reassigned to same-named properties on Controller object. View objects are assigned.
//  View objects are dependent on templating engine, maybe overrideable per call to render?
//  Call render automatically, but calling explicitly allows addl params to be passed in
//    (Pass params object automatically)
JazzFusion.Controller.Action = function(name, controller, func) {
  this.name = name;
  this.controller = controller;
  this.func = func;
  this.view = new JazzFusion.View(controller.options.name, name);
};

// actions must take view, controller, and params objects as params
JazzFusion.Controller.Action.prototype = {
  run: function(params) {
    JazzFusion.currentController = this.controller;
    JazzFusion.currentAction = this;
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
