Scope.export = Observable;

function Observable () {
  this._observers = [];
  this.oldData = null;
  this.data = null;
}

Observable.prototype.set = function (data) {
  this.oldData = this.data;
  this.data = data;

  this.callObservers();
};

Observable.prototype.observe = function (handler) {
  var _this = this;

  if (_this._observers.indexOf(handler) === -1) {
    _this._observers.push(handler);

    if (_this.data) {
      handler.call(_this, _this.data, _this.oldData);
    }
  }

  return {
    destroy: function () {
      _this._observers.splice(_this._observers.indexOf(handler));
    }
  }
}

Observable.prototype.callObservers = function () {
  var _this = this;

  this._observers.forEach(function (handler) {
    handler.call(_this, _this.data, _this.oldData);
  })
}
