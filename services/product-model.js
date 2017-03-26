var apimer = Scope.import('services/apimer.js');
var Observable = Scope.import('services/observable.js');

Scope.export = ProductModel;

function ProductModel(id) {
  var _this = this;
  this.id = id;
  this.data = [];
  this.types = [];
  this.parts = new Observable();
  this.surfaces = new Observable();
  this.setup = new Observable();
  this.imageURL = new Observable();

  this.refresh();
}

ProductModel.prototype.init = function (response) {
  this.data = response ? response.productData : {
    data: []
  };


  var dna = this.data.data[0];
  this.types = this.extractAllTypes();

  debugger;
  // this.initParts();
  // this.initSurfaces();
  //
  // this.setSetup(this._data.data.default);
};

ProductModel.prototype.extractAllTypes = function () {
  var _this = this;
  var data = _this.data.data[0];
  var types = types = [];

  data.data.forEach(function (item) {
    if (types.indexOf(item.type) === -1) {
      types.push(item.type);
    }
  });

  return types;
};

ProductModel.prototype.getNodesByType = function (type) {
  var _this = this;
  var data = _this.data.data[0];
  var nodes = [];

  nodes = data.data.filter(function (item) {
    return item.type === type;
  });
};

ProductModel.prototype.refresh = function () {
  apimer.getProduct(this.id).then(this.init.bind(this));
};

ProductModel.prototype.activeItem = function (part, subPart, noRender) {
  var _this = this;
  var relationships = [];

  if (part.type === 'surfaces') {
    relationships = part.relationships.materials.data;
  } else if (part.type === 'materials') {
    relationships = part.relationships.colors.data;
  } else {
    relationships = part.relationships.choices.data;
  }

  relationships.forEach(function (relation) {
    relation.selected = false;
    if (relation.id === subPart.id) {
      relation.selected = true;
    }
  });

  if (noRender) return;

  var setup = this.generateSetupObject(this.parts.data);

  this.surfaces.data.forEach(function (surface) {
    var materials = _this.getSubParts(surface);
    var colors = _this.getSubParts(materials.selected);
    if (colors.selected) {
      setup[surface.id + '||' + colors.selected.id] = true;
    }
  });

  this.setSetup(setup);
};

ProductModel.prototype.generateSetupObject = function (parts) {
  var _this = this;
  var setup = {};

  parts.forEach(function (part) {
    var subPart = _this.getSubParts(part);
    setup[subPart.selected.id] = true;
  });

  return setup;
};

ProductModel.prototype.setSetup = function (setup) {
  var _this = this;
  _this.setup = setup;

  apimer.renderProduct(_this.id, _this.setup).then(function (response) {
    // _this.imageURL.set(response[ 0 ] || null);
  });
};
