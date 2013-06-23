App.Views.Controls = Backbone.View.extend({
  template: App.template('template-controls'),

  events: {
    "click .btn-save": "saveProject",
    "click .btn-reset": "resetParameters",
    "click .btn-share": "shareProject"
  },

  initialize: function(options) {
    console.log('INIT: controls');
    this.project = options.project;
    this.parameters = options.parameters;

    App.vent.bind('status', this.showStatus, this);
  },

  render: function() {
    console.log('RENDER: controls');
    this.$el.html(this.template());

    if (this.project.isNew()) {
      this.$('.btn-share').hide();
      this.$('.btn-save').tooltip({placement: 'bottom', trigger: 'hover', container: 'body', title: 'Save to new project'});
      this.$('.btn-reset').tooltip({placement: 'bottom', trigger: 'hover', container: 'body', title: 'Reset parameters to default values'});
    } else {
      this.$('.btn-share').tooltip({placement: 'bottom', trigger: 'hover', container: 'body', title: 'Share saved project with others'});
      this.$('.btn-save').tooltip({placement: 'bottom', trigger: 'hover', container: 'body', title: 'Save project to server'});
      this.$('.btn-reset').tooltip({placement: 'bottom', trigger: 'hover', container: 'body', title: 'Reset parameters to last saved values'});
    }

    this.$('.alert').hide();
    return this;
  },

  onClose: function() {
    console.log('CLOSE: controls');
  },

  saveProject: function() {
    console.log('controls: save project');
    var view = this;
    if (this.project.isNew()) {
      // project is new
      if (App.router.isAuthenticated()) {
        // user is logged in
        // view.$('.btn-save').tooltip('hide');
        var projectModal = new App.Views.ProjectModal({project: this.project, parameters: this.parameters, parent: this});
      } else {
        // user is not logged in
        App.vent.trigger('status', 'error', 'Error: You must <a href="/accounts/login/">log in</a> first to save a new project', 5000);
      }
    } else {
      // project already exists
      if (App.user === this.project.get('owner').username) {
        // current user owns project
        this.project.save({parameter_values: this.parameters.getKeyValuePairs()}, {
          success: function() {
            // view.$('.btn-save').tooltip('hide');
            App.vent.trigger('status', 'success', 'Success: Project saved');
            App.vent.trigger('save:parameters');
          },
          error: function(model, response, options) {
            App.vent.trigger('status', 'error', 'Error: unable to save project parameter values');
          }
        });
      } else {
        // current user does not own project
        App.vent.trigger('status', 'error', 'Error: Only the owner of this project can save changes');
      }
    }
  },

  showStatus: function(statusType, message, delay) {
    delay = delay || 3000;
    this.$('.alert').clearQueue();
    this.$('.alert').removeClass().addClass('alert alert-' + statusType);
    this.$('#status').html(message);
    this.$('.alert').show(0);
    this.$('.alert').delay(delay).fadeOut();
  },

  resetParameters: function() {
    console.log('controls: reset parameters');
    App.vent.trigger('reset:parameters');
  },

  shareProject: function() {
    console.log('Sharing project ' + this.project.get('id'));
    var modal = new App.Views.ShareModal();
    modal.render();
  }
});


App.Views.ShareModal = Backbone.View.extend({
  template: App.template('template-share'),

  events: {
    'click .close': 'close',
    'click .btn-close': 'close'
  },

  initialize: function(options) {
    console.log('INIT: share modal');
  },

  render: function() {
    console.log('RENDER: share modal');
    this.$el.html( this.template( {url: location.href } ) );
    $('body').append( this.el );
    this.$('.modal').modal();
    return this;
  },

  onClose: function() {
    console.log('CLOSE: share modal');
    this.$('.modal').modal('hide');
  }
});
