var apimer = Scope.import('services/apimer.js');
var Observable = Scope.import('services/observable.js');

Scope.export = ProductModel;

function ProductModel (id) {
  var _this = this;
  this._id = id;
  this._data = [];
  this.parts = new Observable();
  this.surfaces = new Observable();
  this.setup = new Observable();
  this.imageURL = new Observable();

  this.refresh();
}

ProductModel.prototype.init = function (response) {
  this._data = response ? response.data : {
      data: {
        default: []
      },
      included: []
    };

  this.initParts();
  this.initSurfaces();

  this.setSetup(this._data.data.default);
};

ProductModel.prototype.initParts = function () {
  var _this = this;
  _this.parts.set(_this._data.included.filter(function (item) {
    return item.type === 'parts';
  }));
};

ProductModel.prototype.initSurfaces = function () {
  var _this = this;
  _this.surfaces.set(_this._data.included.filter(function (item) {
    return item.type === 'surfaces';
  }));
};

ProductModel.prototype.getSubParts = function (part) {
  var _this = this;
  var relationships = [];

  if (part.type === 'surfaces') {
    relationships = part.relationships.materials.data;
  } else {
    relationships = part.relationships.choices.data;
  }

  var result = {
    items: [],
    selected: null
  };

  relationships.forEach(function (relation) {
    var item = _this.findInInclude(relation);
    result.items.push(item);

    if (relation.selected) {
      result.selected = item;
    }
  });

  return result;
};

ProductModel.prototype.findInInclude = function (item) {
  if (this._data.included instanceof Array) {
    return this._data.included.filter(function (asset) {
      return asset.type === item.type && asset.id === item.id;
    })[ 0 ];
  }

  return null;
};

ProductModel.prototype.refresh = function () {
  apimer.getProduct(this._id, this.init.bind(this));
};

ProductModel.prototype.activeItem = function (part, subPart) {
  var relationships = part.relationships.choices.data;

  relationships.forEach(function (relation) {
    relation.selected = false;
    if (relation.id === subPart.id) {
      relation.selected = true;
    }
  });

  var setup = this.generateSetupObject(this.parts.data);
  this.setSetup(setup);
};

ProductModel.prototype.generateSetupObject = function (parts) {
  var _this = this;
  var setup = {};

  parts.forEach(function (part) {
    var subPart = _this.getSubParts(part);
    setup[ subPart.selected.id ] = true;
  });

  return setup;
};

ProductModel.prototype.setSetup = function (setup) {
  var _this = this;
  _this.setup = setup;

  apimer.renderProduct(_this._id, _this.setup, function (response) {
    _this.imageURL.set(response[ 0 ] || null);
  });
};
