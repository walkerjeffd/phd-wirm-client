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
    if (this.comments) {
      this.subViews.commentTab = new App.Views.CommentTab({collection: this.comments});
    }
  },

  render: function() {
    console.log('RENDER: tabs');

    this.$el.html( this.template() );

    this.$('#tab-param-basic').html(this.subViews.basicTab.render().el);
    this.$('#tab-param-advanced').html(this.subViews.advancedTab.render().el);

    // if (this.comments) {
    //   this.$('ul.nav').append('<li><a href="#tab-comments" data-toggle="tab">Comments</a></li>');
    //   this.$('.tab-content').append('<div class="tab-pane fade" id="tab-comments"></div>');
    //   this.subViews.commentTab.setElement(this.$('#tab-comments')).render();
    // }

    return this;
  },

  onClose: function() {
    console.log('CLOSE: tabs');
  }
});
