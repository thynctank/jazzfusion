// Various options passed to Controller:
//   beforeAll/afterAll: filters run before and after all actions
//   actions: each of these generates a new Controller.Action object with various methods including init and run, 
//            which is the function the user passes in. run is assigned a this object referencing the parent controller
//   properties: controller/helper methods and properties belonging to the controller which can be called on from any of its actions

// Controller constructor registers itself with the router so it can be called using redirects/actions can be rendered, used for hijaxing links/forms
JazzFusion.Controller = function(options) {
  JazzFusion.setOptions.call(this, options, {
    name: "",
    beforeFilters: {},
    afterFilters: {},
    actions: {
      index: function() {
      }
    }
  });
  
  if(!this.options.name)
    throw("A controller MUST have a name to be routable");
  
  // register with system
  if(!JazzFusion.controllers.has(this.options.name))
    JazzFusion.controllers.set(this.options.name, this);
  
  
  JazzFusion.each(this.options.actions, function(func, action) {
    this[action] = new JazzFusion.Controller.Action(this, func);
  }, this);
  
  this.beforeFilters = this.options.beforeFilters;
  this.afterFilters = this.options.afterFilters;
};

//   actions are built into Action objects and reassigned to same-named properties on Controller object. View objects are assigned.
//   View objects are dependent on templating engine, maybe overrideable per call to render?
//   Call render automatically, but calling explicitly allows addl params to be passed in
//     (Pass params object automatically)
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
  }
};

JazzFusion.Controller.prototype = {
};