/* Galaxy, Galaxy.Scope */

var view = Scope.import('galaxy/view');
var ProductModel = Scope.import('services/product-model.js');

Scope.data.productModel = new ProductModel();

// fetch('https://integrated-configurator-clientapi-accept.3dimerce.mybit.nl/iwc/in3808').then(function (response) {
fetch('https://integrated-configurator-clientapi-accept.3dimerce.mybit.nl/bertplantagie/blake_joni_tara').then(function (response) {
  response.json().then(function (data) {
    Scope.data.productModel.init('in3808', data);
  });
});

console.info(Scope.data.productModel);

view.config.cleanContainer = true;
view.init([
  {
    tag: 'main',
    text: [
      'data.productModel',
      function (model, id) {
        return JSON.stringify(model.groups, null, 2);
        // return null;
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