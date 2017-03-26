Scope.export = {
  test: function () {
    alert();
  },
  getProduct: function (id) {
    return fetch('https://datamer-accept.3dimerce.mybit.nl/products/' + id).then(function (response) {
      return response.json();
    });
  },
  renderProduct: function (id, setup) {
    nanoajax.ajax('https://datamer-accept.3dimerce.mybit.nl/products/' + id + '/resource', {
      method: 'PUT',
      mode: 'cors',
      // url: 'https://apimer.3dimerce.mybit.nl/products/' + id + '/resource/jpg',
      body: JSON.stringify({setup: setup})
    }).then(function (response) {
      return response.json();
    });
  }
};
