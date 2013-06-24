App.Views.Tabs = Backbone.View.extend({
  template: App.template('template-tabs'),

  initialize: function(options) {
    console.log('INIT: tabs');
    this.parameters = options.parameters;
    this.project = options.project;
    this.comments = options.comments;

    this.subViews = {};
    this.subViews.basicTab = new App.Views.ParametersTab({parameters: this.parameters, group: 'basic'});
    this.subViews.advancedTab = new App.Views.ParametersTab({parameters: this.parameters, group: 'advanced'});
    if (!this.project.isNew()) {
      this.subViews.commentTab = new App.Views.CommentTab({collection: this.comments, project: this.project});
    }
  },

  render: function() {
    console.log('RENDER: tabs');

    this.$el.html( this.template() );

    this.$('#tab-param-basic').html(this.subViews.basicTab.render().el);
    this.$('#tab-param-advanced').html(this.subViews.advancedTab.render().el);

    if (this.project.isNew()) {
      this.$('ul.nav-tabs > li:last').remove();
      this.$('#tab-comments').remove();
    } else {
      this.$('#tab-comments').html(this.subViews.commentTab.render().el);
    }

    return this;
  },

  onClose: function() {
    console.log('CLOSE: tabs');
  }
});
