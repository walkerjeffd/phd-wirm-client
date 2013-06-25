App.Views.Loading = Backbone.View.extend({
  template: App.template('template-loading'),

  render: function() {
    console.log('RENDER: loading');
    this.$el.html( this.template() );
    return this;
  },

  onClose: function() {
    console.log('CLOSE: loading');
  }
});