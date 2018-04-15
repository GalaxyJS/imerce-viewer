const customer = 'bertplantagie';
const product = 'blake_joni_tara';

Scope.exports = {
  queryBuilder: function (params) {
    const esc = encodeURIComponent;
    const query = Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');

    return query;
  },
  verifySetup: function (setup) {
    const url = this.getSetupURL(setup);
    return fetch(url).then(function (response) {
      return response.json();
    });
  },
  getSetupURL: function (setup) {
    const path = [customer, product, 'setup'].join('/');

    return this.getURL(path, setup);
  },
  getImageURL: function (setup, width, height, extension) {
    const request = Object.assign({}, setup);

    const query = JSON.stringify(request);
    const hash = CryptoJS.SHA256(query);

    const pixelRatio = window.devicePixelRatio || 1;
    const resolution = [width * pixelRatio, height * pixelRatio].join('x');

    const image = [hash, resolution].join('-');
    const filename = [image, extension || 'jpg'].join('.');

    const path = [customer, product, filename].join('/');

    return this.getURL(path, request);
  },
  getURL: function (path, params) {
    const query = this.queryBuilder(params);
    const uri = ['https://integrated-configurator-clientapi-accept.3dimerce.mybit.nl', path].join('/');

    return [uri, query].join('?');

  },
  getThumbnailURL: function (permalink, width, height) {
    const path = ['https://integrated-configurator-clientapi-accept.3dimerce.mybit.nl', customer, product].join('/');
    const resolution = '-' + [width, height].join('x');
    const parts = permalink.split('.jpg?');
    const url = [parts[0], resolution, '.jpg?', parts[1]].join('');
    return [path, url].join('/');
  }
};