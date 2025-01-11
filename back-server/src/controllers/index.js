module.exports = function (app, router) {
  require("./AuthenticationController")(app, router);
  require("./OrderController")(app, router);
  require("./RecipeController")(app, router);
  require("./UserController")(app, router);
};
