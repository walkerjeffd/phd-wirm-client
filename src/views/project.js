App.Views.ProjectInfo = Backbone.View.extend({
  template: App.template('template-project-info'),

  events: {
    "click .btn-edit": "editProject",
    "click .btn-delete": "deleteProject",
    "click .alert .btn-confirm": "deleteProjectConfirm",
    "click .alert .btn-cancel": "deleteProjectCancel"
  },

  initialize: function(options) {
    console.log('INIT: project info');
    this.project = options.project;
    this.parameters = options.parameters;

    this.listenTo(this.project, 'sync', this.render, this);
    this.listenTo(this.project, 'destroy', function() { App.router.navigate('/', {trigger: true}); });
  },

  render: function() {
    console.log('RENDER: project info');
    this.$el.html( this.template( this.project.toJSON() ) );
    this.$('.alert').hide();
    return this;
  },

  onClose: function() {
    console.log('CLOSE: project info');
  },

  editProject: function() {
    console.log('controls: edit project ' + this.project.get('id'));
    if (App.user === this.project.get('owner').username) {
      // current user owns project
      var projectModal = new App.Views.ProjectModal({project: this.project, parameters: this.parameters, title: 'Edit Project Info'});
    } else {
      // current user does not own project
      App.vent.trigger('status', 'error', 'Error: Only the owner of this project can edit it');
    }
  },

  deleteProjectConfirm: function() {
    this.project.destroy();
  },

  deleteProjectCancel: function() {
    this.$('.alert').toggle();
  },

  deleteProject: function() {
    var view = this;
    console.log('controls: delete project ' + this.project.get('id'));
    if (App.user === this.project.get('owner').username) {
      // current user owns project
      this.$('.alert').slideDown();
    } else {
      // current user does not own project
      App.vent.trigger('status', 'error', 'Error: Only the owner of this project can delete it');
    }
  }
});

// project list
App.Views.ProjectListContainer = Backbone.View.extend({
  template: App.template('template-project-container'),

  initialize: function() {
    console.log('INIT: project list container');
    this.subViews = {};
    this.subViews.projectList = new App.Views.ProjectList({collection: this.collection});
    // this.listenTo(this.collection, 'sync add remove change', this.render);
  },

  render: function() {
    console.log('RENDER: project list container');
    this.$el.html( this.template() );
    if (!(App.router.isAuthenticated())) {
      this.$el.append('<p>You must be logged in to view saved projects. Click here to <a href="/accounts/login/">log in</a> or <a href="/accounts/register/">sign up</a>.</p>');
    } else if (this.collection.isEmpty()) {
      this.$el.append('<p>You have no saved projects. <a href="#">Click here</a> to start a new project</p>');
    } else {
      this.$el.append(this.subViews.projectList.render().el);
    }
  },

  onClose: function() {
    console.log('CLOSE: project list container');
  }
});

App.Views.ProjectList = Backbone.View.extend({
  tagName: 'ul',

  className: 'project-list',

  initialize: function() {
    console.log('INIT: project list');
    this.subViews = [];
  },

  render: function() {
    console.log('RENDER: project list');
    var view = this;

    this.$el.empty();

    this.collection.each(function(project) {
      var projectItem = new App.Views.ProjectListItem({model: project});
      view.subViews.push(projectItem);
      view.$el.append(projectItem.render().el );
    });

    return this;
  },

  onClose: function() {
    console.log('CLOSE: project list');
  }
});

// project list item
App.Views.ProjectListItem = Backbone.View.extend({
  tagName: 'li',

  className: 'project-item',

  model: App.Models.Project,

  template: App.template('template-project-item'),

  events: {
    'click .btn-delete': 'deleteProject'
  },

  initialize: function() {
    console.log('INIT: project list item for id ' + this.model.get('id'));
  },

  render: function() {
    console.log('RENDER: project list item');
    var context = this.model.toJSON();
    var view = this;

    context.created = moment(context.created).format('MMM D YYYY h:mm a');
    context.updated = moment(context.updated).format('MMM D YYYY h:mm a');
    context.createdFromNow = moment(context.created).fromNow();
    context.updatedFromNow = moment(context.updated).fromNow();
    this.$el.html( this.template( context ) );
    
    this.$('.alert').hide();
    this.$('.alert .btn-confirm').on('click', function() {
      view.model.destroy();
      view.close();
    });
    this.$('.alert .btn-cancel').on('click', function() {
      view.$('.alert').toggle();
    });
    return this;
  },

  deleteProject: function() {
    this.$('.alert').slideDown();
  },

  onClose: function() {
    console.log('CLOSE: project list item for id ' + this.model.get('id'));
  }
});

// modal for saving/editing project
App.Views.ProjectModal = Backbone.View.extend({
  template: App.template('template-project-modal'),

  events: {
    'click .btn-save': 'saveProject',
    'click .close': 'close',
    'click .btn-close': 'close'
  },

  initialize: function(options) {
    console.log('INIT: project modal');
    this.project = options.project;
    this.parameters = options.parameters;
    this.title = options.title || 'Create Project';

    this.project.set('parameter_values', this.parameters.getKeyValuePairs());

    this.listenTo(this.project, 'sync', this.postSave, this);
    this.listenTo(this.project, 'error', this.showError);
    this.listenTo(this.project, 'invalid', this.showInvalid);

    this.render();
  },

  render: function() {
    console.log('RENDER: project modal');
    this.$el.html( this.template( this.project.toJSON() ) );
    this.$('#projectModalLabel').text(this.title);
    $('body').append( this.el );
    this.$('.alert').hide();
    this.$('.modal').modal();
    return this;
  },

  saveProject: function() {
    console.log('project modal: saving project');
    this.project.save({
      title: this.$("input[name='title']").val(),
      location: this.$("input[name='location']").val(),
      description: this.$("textarea[name='description']").val()
    }, {
      wait: true
    });
  },

  postSave: function() {
    console.log('SUCCESS: project saved');
    App.vent.trigger('status', 'success', 'Project saved');
    this.close();
    App.router.navigate('/projects/' + this.project.get('id'), {trigger: true});
  },

  onClose: function() {
    console.log('CLOSE: project modal');
    this.$('.modal').modal('hide');
  },

  showError: function(model, xhr, options) {
    console.log('ERROR: unable to save project');
    this.showStatus('Error: Unable to save model.');
    console.log(xhr);
  },

  showInvalid: function(model, error, options) {
    this.showStatus('Error: ' + error);
    console.log('Invalid model: ' + error);
  },

  showStatus: function(message) {
    this.$('.alert').clearQueue();
    this.$('.alert').html(message);
    this.$('.alert').show();
  }
});
