//  actions are built into Action objects and reassigned to same-named properties on Controller object. View objects are assigned.
//  View objects are dependent on templating engine, maybe overrideable per call to render?
//  Call render automatically, but calling explicitly allows addl params to be passed in
//    (Pass params object automatically)
JazzFusion.Controller.Action = function(controller, func) {
  this.controller = controller;
  this.func = func;
  this.view = new JazzFusion.View();
  
  // build custom before/after filter lists for this action
  this.beforeFilters = function() {
    
  };
  this.afterFilters = function() {
    
  };
};

// actions must take view, controller, and params objects as params
JazzFusion.Controller.Action.prototype = {
  run: function(params) {
    JazzFusion.currentController = this.controller;
    JazzFusion.currentAction = this;

    this.view.hasRendered = false;
    this.beforeFilters();
    this.func(this.view, this.controller, params);
    this.view.render();
    this.afterFilters();
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
