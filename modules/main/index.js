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
view.init({
  class: 'interface',
  children: [
    {
      tag: 'main'
      // text: [
      //   'data.productModel',
      //   function (model, id) {
      //     return JSON.stringify(model.groups, null, 2);
      //     // return null;
      //   }
      // ]
    },
    {
      tag: 'footer',
      children: [
        // {
        //   class: 'title-items-bar',
        //   module: {
        //     url: 'modules/choices-bar/index.js'
        //   },
        //   inputs: {
        //     option: '<>data.productModel.activeOption'
        //   },
        //   on: {
        //     // 'group-select': groupSelect
        //   }
        // },
        {
          class: 'title-items-bar small-bold',
          module: {
            url: 'modules/options-bar/index.js'
          },
          inputs: {
            agroup: '<>data.productModel.activeGroup'
          },
          on: {
            'option-select': optionSelect
          }
        },
        {
          class: 'title-items-bar',
          module: {
            url: 'modules/groups-bar/index.js'
          },
          inputs: {
            data: '<>data.productModel.groups'
          },
          on: {
            'group-select': groupSelect
          }
        }
      ]
    }

  ]
});

function groupSelect(event) {
  // if (Scope.data.productModel.activeGroup)
  if (Scope.data.productModel.activeGroup && Scope.data.productModel.activeGroup.id)
    Scope.data.productModel.setActiveGroupById(null);
  else
    Scope.data.productModel.setActiveGroupById(event.detail.groupId);
}

function optionSelect(event) {
  // Scope.data.productModel.setActiveOptionById(null);
  Scope.data.productModel.setActiveOptionById(event.detail.optionId);
}