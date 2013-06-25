App.Router.Workspace = Backbone.Router.extend({
  routes: {
    "": "newProject",
    "projects": "projectList",
    "projects/:id": "loadProject",
    "load": "loading",
    "*path": "unknownPath"
  },

  initialize: function(options) {
    console.log('INIT: router');
    this.el = options.el;

    this.onFirstView = true;

    // // set up models/collections
    // this.project = new App.Models.Project();
    // this.projects = new App.Collections.Projects();
    // this.parameters = new App.Collections.Parameters();
    // this.comments = new App.Collections.Comments([], {project: this.project});

    // // initialize dashboard view
    // this.dashboard = new App.Views.Dashboard({parameters: this.parameters,
    //                                           project: this.project,
    //                                           comments: this.comments});

    // // initialize project list view
    // this.projectListContainer = new App.Views.ProjectListContainer({collection: this.projects});

    // // fetch default parameters
    // this.parameters.fetch();

    // // update values in parameters collection when project is fetched
    // this.listenTo(this.parameters, 'sync', function() { App.vent.trigger('save:parameters'); });
    // this.listenTo(this.project, 'sync', this.postProjectSync);

    // // show all events for debugging
    // this.listenTo(this.project, 'all', function(eventName) {console.log('EVENT - project : ' + eventName);});
    // this.listenTo(this.projects, 'all', function(eventName) {console.log('EVENT - projects : ' + eventName);});
    // this.listenTo(this.parameters, 'all', function(eventName) {console.log('EVENT - parameters : ' + eventName);});
  },

  loading: function() {
    console.log("ROUTE: loading");
    var loadingView = new App.Views.Loading();
    this.showView(loadingView);
  },

  showView: function(view) {
    if (this.currentView) {
      this.currentView.close();
    }

    this.currentView = view;
    this.currentView.render();

    $(this.el).html(this.currentView.el);
  },

  showLoading: function() {
    if (!this.onFirstView) {
      var loadingView = new App.Views.Loading();
      this.showView(loadingView);  
    }

    this.onFirstView = false;
  },

  newProject: function() {
    console.log('ROUTE: new project');
    var router = this;

    this.showLoading();

    // set up models/collections
    var project = new App.Models.Project();
    var parameters = new App.Collections.Parameters();

    // initialize dashboard view
    var dashboard = new App.Views.Dashboard({parameters: parameters,
                                             project: project});

    parameters.fetch({
      success: function(collection, response, options) {
        collection.saveRevert();
        router.showView(dashboard);
      },
      error: function(collection, response, options) {
        router.showError('Error Fetching Default Parameters', 'Server responded with status ' + response.status + ': ' + response.statusText + '.');
      }
    });
  },

  projectList: function() {
    // show list of saved projects for current user
    console.log('ROUTE: project list');
    var router = this;

    this.showLoading();

    projects = new App.Collections.Projects();
    
    // initialize project list view
    projectListView = new App.Views.ProjectListContainer({collection: projects});

    projects.fetch({
      success: function(collection, response, options) {
        router.showView(projectListView);
      },
      error: function(collection, response, options) {
        router.showError('Error Fetching Project List', 'Server responded with status ' + response.status + ': ' + response.statusText + '.');
      }
    });
  },

  loadProject: function(id) {
    console.log('ROUTE: load project');
    var router = this;

    this.showLoading();

    var project = new App.Models.Project({id: id});
    var parameters = new App.Collections.Parameters();
    var comments = new App.Collections.Comments([], {project: project});

    // initialize dashboard view
    var dashboard = new App.Views.Dashboard({parameters: parameters,
                                             project: project,
                                             comments: comments});

    parameters.fetch({
      success: function(collection, response, options) {
        project.fetch({
          success: function(model, response, options) {
            var projectParameters = project.get('parameter_values');
            parameters.each(function(parameter) {
              parameter.set('value', projectParameters[parameter.get('key')]);
            });
            App.vent.trigger('save:parameters');
            comments.fetch();
            router.showView(dashboard);
          },
          error: function(model, response, options) {
            console.log('ERROR: fetching project ' + id);
            if (response.status === 404) {
              router.showError('Project Not Found', 'The project with id ' + id + ' was not found by the server.');
            } else {
              router.showError('Error Fetching Project', 'Server responded with status ' + response.status + ': ' + response.statusText + '.');
            }
          }
        });
      },
      error: function(collection, response, options) {
        console.log('ERROR: fetching parameters');
        router.showError('Error Fetching Default Parameters', 'Server responded with status ' + response.status + ': ' + response.statusText + '.');
      }
    });
  },

  showError: function(title, message) {
    errorView = new App.Views.Error({title: title, message: message});
    this.showView(errorView);
  },

  unknownPath: function(path) {
    this.showError('Unknown Path', 'The URL path #' + path + ' in invalid.');
  },

  isAuthenticated: function() {
    return App.user !== null;
  }
});

App.boot = function(container) {
  // initialize application
  container = $(container);
  App.router = new App.Router.Workspace({el: container});
  Backbone.history.start({root: "/client/"});
};