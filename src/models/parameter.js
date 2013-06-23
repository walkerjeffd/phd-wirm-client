App.Models.Parameter = Backbone.Model.extend({
  urlRoot: '/api/parameters/',

  saveRevert: function() {
    // cache attributes
    this._revertAttributes = _.clone(this.attributes);
  },

  revert: function() {
    // replace parameter attributes with cached attributes
    if (this._revertAttributes) {
      this.set(this._revertAttributes);
    } else {
      console.log('ERROR: Unable to revert parameter, cannot find cached values');
    }
  }
});