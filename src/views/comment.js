App.Views.CommentTab = Backbone.View.extend({
  template: App.template('template-comment-tab'),

  events: {
    'click #submit-comment': 'submitComment'
  },

  initialize: function(options) {
    console.log('INIT: comment tab');
    this.project = options.project;

    this.subViews = {};
    this.subViews.commentList = new App.Views.CommentList({collection: this.collection});
  },

  render: function() {
    console.log('RENDER: comment tab');
    var view = this;
    view.$el.html(this.template());
    this.$('.comment-list-container').html( this.subViews.commentList.el );
    return this;
  },

  submitComment: function(e) {
    e.preventDefault();
    var comment = this.$("input[name='comment']").val();
    this.collection.create({'comment': comment},
      { wait: true,
        success:function() {
          App.vent.trigger('status', 'success', 'Comment saved');
          this.$("input[name='comment']").val('');
          console.log('added comment');
        },
        error: function(model, xhr, options) {
          this.$("input[name='comment']").val('');
          App.vent.trigger('status', 'error', 'Unable to save comment');
          console.log(xhr);
      }
    });
  },

  onClose: function() {
    console.log('CLOSE: comment tab');
  }
});

App.Views.CommentList = Backbone.View.extend({
  tagName: 'ul',

  className: 'comment-list',

  initialize: function() {
    console.log('INIT: comment list');

    this.subViews = [];

    // this.listenToOnce(this.collection, 'reset', this.render, this);
    // this.listenTo(this.collection, 'change', this.render, this);
    // this.listenTo(this.collection, 'remove', this.render, this);
    this.listenTo(this.collection, 'add', this.addOne, this);
    // this.listenTo(this.collection, 'reset', this.render, this);
  },

  render: function() {
    console.log('RENDER: comment list');
    var view = this;
    // view.$el.empty();
    if (this.collection.isEmpty()) {
      this.$el.html('No comments.');
    } else {
      this.addAll();
    }
    return this;
  },

  addOne: function(comment) {
    var commentListItem = new App.Views.CommentListItem({model: comment});
    this.subViews.push(commentListItem);
    this.$el.append( commentListItem.render().el );
  },

  addAll: function() {
    var view = this;
    this.$el.html('');
    this.collection.each( function(comment) {
      view.addOne(comment);
    });
  },

  onClose: function() {
    console.log('CLOSE: comment list');
  }
});

App.Views.CommentListItem = Backbone.View.extend({
  tagName: 'li',

  className: 'comment-item',

  template: App.template('template-comment-item'),

  events: {
    'click .btn-delete': 'deleteComment'
  },

  initialize: function() {
  },

  render: function() {
    console.log('RENDER: comment list item for id ' + this.model.get('id'));
    var context = this.model.toJSON();
    context.formatCreated = moment(context.created).fromNow();
    this.$el.html( this.template( context ) );
    return this;
  },

  deleteComment: function() {
    this.model.destroy({
      wait: true,
      success: function() {
        App.vent.trigger('status', 'success', 'Comment deleted');
      },
      error: function() {
        App.vent.trigger('status', 'error', 'Unable to delete comment');
      }
    });
    this.close();
  },

  onClose: function() {
    console.log('CLOSE: comment list item for id ' + this.model.get('id'));
  }
});