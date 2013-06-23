App.Views.Dashboard = Backbone.View.extend({
  template: App.template('template-dashboard'),

  initialize: function(options) {
    console.log('INIT: dashboard');

    this.parameters = this.options.parameters;
    this.project = this.options.project;
    this.comments = this.options.comments;

    // this.$el.html( this.template() );

    // create sub-views
    this.subViews = {};
    if (!this.project.isNew()) {
      this.subViews.projectInfo = new App.Views.ProjectInfo({project: this.project, parameters: this.parameters});
    }
    this.subViews.controls = new App.Views.Controls({project: this.project, parameters: this.parameters});
    this.subViews.tabsView = new App.Views.Tabs({project: this.project, parameters: this.parameters, comments: this.comments});
    this.subViews.chartView = new App.Views.Chart({
      // el: this.$('#chart-container'),
      chartOptions: {
        width: 500,
        height: 400,
        color: d3.scale.category10(),
        xLabel: 'Distance Downstream (km)',
        yLabel: 'Concentration (mg/L)'
      },
      parameters: this.parameters,
      engine: App.SimulationEngine
    });

    // this.render();
  },

  render: function() {
    console.log('RENDER: dashboard');

    // initialize element
    this.$el.html( this.template() );

    if (this.project.isNew()) {
      this.$('#project-info').html("<h1>New Project</h1>");
    } else {
      this.$('#project-info').html(this.subViews.projectInfo.render().el);
    }
    this.$('#controls').html(this.subViews.controls.render().el);
    this.$('#chart-container').html(this.subViews.chartView.render().update().el);
    this.$('#tabs-container').html(this.subViews.tabsView.render().el);

    return this;
  },

  onClose: function() {
    console.log('CLOSE: dashboard');
  }
});
