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
  renderProduct: function (id, setup, callback) {
    nanoajax.ajax({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://apimer.3dimerce.mybit.nl/products/' + id + '/resource/jpg',
      body: JSON.stringify({ setup: setup })
    }, function (code, responseText) {
      callback(JSON.parse(responseText || 'null'));
    });
  }
};
