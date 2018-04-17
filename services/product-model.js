Scope.exports = ProductModel;

function ProductModel() {
  this.activeGroup = null;
  this.activeOption = null;
  this.activeChoice = {};
  this.activeCamera = {};
  this.groupsSubject = {};
  this.blacklistSubject = {};
  this.camerasSubject = {};

  this.setupSubject = {};
  this.data = {};
  this.blacklist = {};
  this.setup = {};
  this.images = {};
  this.uiTypeOverwrites = {};
  this.uiHierarchyConfig = [];
  this.groupsActiveOption = {};
  this.productId = null;

  this.groups = [];
}

ProductModel.prototype.init = function (productId, data) {
  this.productId = productId;
  this.blacklist = data.blacklist;
  this.setup = data.setup;
  this.images = data.images;
  this.data = data.data;

  this.populateAppData();
};

ProductModel.prototype.update = function (data) {

};

ProductModel.prototype.populateAppData = function () {
  const _this = this;
  const keys = Object.keys(this.data);
  const groups = [];
  const groupsMap = {};

  keys.forEach(function (key) {
    let part = _this.data[key];

    let group = {};
    part.forEach(function (item) {
      if (item.hasOwnProperty('group')) {
        if (!groupsMap.hasOwnProperty(item.group)) {
          let g = groupsMap[item.group] = {
            id: item.group,
            data: [],
            ui: {}
          };

          groups.push(g);
        }
        group = groupsMap[item.group];

        if (item.materials) {
          // debugger;
          item.materials = item.materials.map(function (material) {
            return _this.getMaterialById(material.id);
          });
          // debugger;
        }

        group.data.push(item);
      }
    });
  });

  this.groups = groups;
};

ProductModel.prototype.getMaterialById = function (id) {
  return this.data.materials.filter(function (material) {
    return material.id === id;
  })[0];
};

ProductModel.prototype.setActiveGroupById = function (id) {
  this.activeGroup = this.groups.filter(function (group) {
    return group.id === id;
  })[0] || null;
};

ProductModel.prototype.setActiveOptionById = function (id) {
  if (!this.activeGroup || !this.activeGroup.data) {
    return;
  }

  this.activeOption = this.activeGroup.data.filter(function (group) {
    return group.id === id;
  })[0] || null;
};

