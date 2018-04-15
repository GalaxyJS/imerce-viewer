Scope.exports.schema = {
  class: 'active-state',
  'data-position': [
    'data.notifyActiveState',
    function () {
      const _this = this;
      const active = _this.parent.querySelector('.active');
      if (active) {
        _this.node.style.top = active.offsetTop + 'px';
        _this.node.style.left = active.offsetLeft + 'px';
      } else {
        _this.node.style.top = null;
        _this.node.style.left = null;
        return 'hide';
      }
    }
  ]
};

Scope.exports.update = function (scope) {
  scope.data.notifyActiveState = new Date().getTime();
};