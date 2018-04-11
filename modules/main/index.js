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

Scope.data.setup = {};

console.info(Scope.data.productModel);

view.config.cleanContainer = true;
view.init({
  class: 'interface',
  children: [
    {
      tag: 'main',
      children: [
        {
          class: 'view',
          inputs: {
            setup: '<>data.setup'
          },
          module: {
            url: 'modules/view/index.js'
          }
        }
      ]
    },
    {
      tag: 'div',
      class: 'control-panel',
      children: [
        {
          class: 'title-items-bar',
          module: {
            url: 'modules/groups-bar/index.js'
          },
          inputs: {
            data: '<>data.productModel.groups',
            activeGroup: '<>data.productModel.activeGroup.id'
          },
          on: {
            'group-select': groupSelect
          }
        },
        {
          tag: 'section',
          class: 'section-content',
          children: [
            {
              tag: 'h2',
              class: 'active-section-title',
              text: '<>data.productModel.activeGroup.id'
            },
            {
              class: 'title-items-bar small-bold',
              module: {
                url: 'modules/options-bar/index.js'
              },
              inputs: {
                agroup: '<>data.productModel.activeGroup',
                activeOptionId: '<>data.productModel.activeOption.id'
              },
              on: {
                'option-select': optionSelect
              }
            }
          ]
        }
      ]
    }

  ]
});

function groupSelect(event) {
  const activeGroup = Scope.data.productModel.activeGroup;
  if (activeGroup && activeGroup.id === event.detail.groupId) {
    Scope.data.productModel.setActiveGroupById(null);
  } else {
    Scope.data.productModel.setActiveGroupById(event.detail.groupId);
  }
}

function optionSelect(event) {
  // Scope.data.productModel.setActiveOptionById(null);
  Scope.data.productModel.setActiveOptionById(event.detail.optionId);
}