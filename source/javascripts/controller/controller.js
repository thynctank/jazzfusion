JazzFusion.AppController = new JazzFusion.BaseController({
});

JazzFusion.Controller = function(options) {
  JazzFusion.setOptions.call(this, options, JazzFusion.AppController.options);
  JazzFusion.extend.call(this, JazzFusion.BaseController);
  this.init();
};
