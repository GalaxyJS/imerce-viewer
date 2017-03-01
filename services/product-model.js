var apimer = Scope.import('services/apimer.js');
var Observable = Scope.import('services/observable.js');

Scope.export = ProductModel;

function ProductModel(id) {
  this._id = id;
  this._data = [];
  this.parts = new Observable();

  this.refresh();
}

ProductModel.prototype.init = function (response) {
  this._data = response ? response.data : {
      included: []
    };

  this.initParts();
};

ProductModel.prototype.initParts = function () {
  this.parts.set(this._data.included.filter(function (item) {
    return item.type === 'parts';
  }));
};

ProductModel.prototype.refresh = function () {
  apimer.getProduct(this._id, this.init.bind(this));
};