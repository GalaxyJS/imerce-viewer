Scope.export = {
  test: function () {
    alert();
  },
  getProduct: function (id, callback) {
    return nanoajax.ajax({
      method: 'GET',
      url: 'https://apimer.3dimerce.mybit.nl/products/' + id + '/'
    }, function (code, responseText) {
      callback(JSON.parse(responseText || 'null'));
    });
  },
  renderProduct: function (id, setup) {
    nanoajax.ajax({
      method: 'PUT',
      url: 'https://apimer.3dimerce.mybit.nl/products/' + id + '/resource/jpg',
      body: JSON.stringify(setup)
    }, function (code, responseText) {
      console.log(code, responseText);
    });
  }
};