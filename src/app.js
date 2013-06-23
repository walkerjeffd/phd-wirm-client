// backbone namespacing
window.App = {
  Models: {},
  Collections: {},
  Views: {},
  Router: {}
};

// custom events object
App.vent = _.extend({}, Backbone.Events);

// template helper function
App.template = function(id) {
  return _.template( $('#' + id).html() );
};

// add close method to Backbone.View
Backbone.View.prototype.close = function(){
  if (this.subViews) {
    _.each(this.subViews, function(view, key) {
      view.close();
    });
  }
  if (this.onClose) {
    this.onClose();
  }
  this.remove();
  this.unbind();
  this.stopListening();
};