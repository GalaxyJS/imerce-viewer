/* Galaxy, Galaxy.Scope */

var view = Scope.import('galaxy/view');
var ProductModel = Scope.import('services/product-model.js');

Scope.data.productModel = new ProductModel();

fetch('https://integrated-configurator-clientapi-accept.3dimerce.mybit.nl/iwc/in3808').then(function (response) {
  response.json().then(function (data) {
    Scope.data.productModel.init('in3808', data);
  });
});

console.info(Scope);

view.init([
  {
    tag: 'main',
    text: [
      'data.productModel',
      function (model, id) {
        return JSON.stringify(model, null, 2);
      }
    ]
  },
  {
    tag: 'footer',
    children: [
      {
        class: 'choice-bar'
      },
      {
        class: 'option-bar'
      },
      {
        class: 'group-bar'
      }
    ]
  }

]);