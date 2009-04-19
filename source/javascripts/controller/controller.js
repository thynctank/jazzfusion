JazzFusion.Controller = function(options) {
  JazzFusion.setOptions.call(this, options, {
    name: "",
    actions: {},
    beforeFilter: function(){},
    afterFilter: function(){}
  });
  
  if(!this.options.name)
    throw("A controller MUST have a name to be routable");
  
  // register with system
  if(!JazzFusion.controllers.has(this.options.name))
    JazzFusion.controllers.set(this.options.name, this);
  
  this.beforeFilter = this.options.beforeFilter;
  this.afterFilter = this.options.afterFilter;
  
  JazzFusion.each(this.options.actions, function(func, action) {
    this[action] = new JazzFusion.Controller.Action(action, this, func);
  }, this);
  
  // load up any helpers
  JazzFusion.loadScript(JazzFusion.baseHref + "app/helpers/" + this.options.name + ".js");
};

JazzFusion.Controller.prototype = {
};