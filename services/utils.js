Scope.exports = {
  whenListIsNotEmpty: function (propPath) {
    return [
      propPath,
      function (list) {
        return list ? Boolean(list.length) : false;
      }
    ];
  },

  whenListIsEmpty: function (propPath) {
    return [
      propPath,
      function (list) {
        return list ? !Boolean(list.length) : true;
      }
    ];
  }
};