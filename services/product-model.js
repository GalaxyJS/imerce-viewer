Scope.exports = ProductModel;

function ProductModel() {
  this.activeGroup = {};
  this.activeOption = {};
  this.activeChoice = {};
  this.activeCamera = {};
  this.groupsSubject = {};
  this.blacklistSubject = {};
  this.camerasSubject = {};

  this.setupSubject = {};
  this.blacklist = {};
  this.setup = {};
  this.images = {};
  this.uiTypeOverwrites = {};
  this.uiHierarchyConfig = [];
  this.groupsActiveOption = {};
  this.productId = null;
}

ProductModel.prototype.init = function (productId, data) {
  this.productId = productId;
  this.blacklist = data.blacklist;
  this.setup = data.setup;
  this.images = data.images;
};

ProductModel.prototype.update = function (data) {

};

