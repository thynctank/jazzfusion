// Various options passed to Controller:
//   beforeAll/afterAll: filters run before and after all actions
//   actions: each of these generates a new Controller.Action object with various methods including init and run, 
//            which is the function the user passes in. run is assigned a this object referencing the parent controller
//   properties: controller/helper methods and properties belonging to the controller which can be called on from any of its actions

// Controller constructor registers itself with the router so it can be called using redirects/actions can be rendered, used for hijaxing links/forms
JazzFusion.Controller = function(options) {
  JazzFusion.setOptions.call(this, options, {
    beforeAll: function() {},
    afterAll: function() {},
    actions: {
      index: function() {
        JazzFusion.puts("Visited index");
      }
    }
  });
  
  
  
  JazzFusion.each(this.options.actions, function(func, action) {
    this.options[action] = new JazzFusion.Controller.Action(this, func);
  }, this);
  
  this.beforeAll = this.options.beforeAll;
  this.afterAll = this.options.afterAll;
};

//   actions are built into Action objects and reassigned to same-named properties on Controller object. View objects are assigned.
//   View objects are dependent on templating engine, maybe overrideable per call to render?
//   Call render automatically, but calling explicitly allows addl params to be passed in
//     (Pass params object automatically)
//   Within view code you can call helpers as this.helper_method_name() in embedded JS
//   Need to build (fast!) JS parser to handle var assignment, params and multi-line JS blocks.
//   First just allow substitution and simple parameterless function calls
JazzFusion.Controller.Action = function(controller, runFunc) {
  this.view = JazzFusion.viewParser.newView();
  this.run = function() {
    this.init();
    controller.beforeAll();
    runFunc();
    controller.afterAll();
  };
};

JazzFusion.Controller.Action.prototype = {
  init: function() {
    
  }
};

JazzFusion.Controller.prototype = {
  
};