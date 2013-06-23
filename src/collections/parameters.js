App.Collections.Parameters = Backbone.Collection.extend({
  model: App.Models.Parameter,

  url: '/api/parameters/',

  initialize: function(models, options) {
    App.vent.bind('reset:parameters', this.revert, this);
    App.vent.bind('save:parameters', this.saveRevert, this);
  },

  saveRevert: function() {
    // cache attributes of all parameters
    console.log('parameters: saving parameter state');
    this.each(function(parameter) {
      parameter.saveRevert();
    });
  },

  revert: function() {
    // revert to cached attributes of all parameters
    console.log('parameters: reverting parameter state');
    this.each(function(parameter) {
      parameter.revert();
    });
  },

  getKeyValuePairs: function() {
    // helper function to convert parameter values to key->value pairs
    var keyValues = {};
    this.each(function(d) { keyValues[d.get('key')] = d.get('value'); });
    return keyValues;
  }
});
