// chart view of simulation model output
App.Views.Chart = Backbone.View.extend({
  initialize: function(options) {
    console.log('INIT: chart');
    var view = this;

    this.engine = options.engine;
    this.parameters = options.parameters;

    this.rendered = false;

    this.chart = new App.Chart();

    _.each(this.options.chartOptions, function(value, key) {
      view.chart[key](value);
    });

    this.listenTo(this.parameters, 'change:value', this.update);
  },

  render: function() {
    console.log('RENDER: chart');
    this.chart(this.el);
    this.rendered = true;
    return this;
  },

  update: function() {
    console.log('UPDATE: chart');
    if (this.rendered) {
      this.chart.data( this.engine( this.parameters.getKeyValuePairs() ) );
    }
    return this;
  },

  onClose: function() {
    console.log('CLOSE: chart view');
  }
});
