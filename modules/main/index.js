/* Galaxy, Galaxy.Scope */

const view = Scope.import('galaxy/view');
const ProductModel = Scope.import('services/product-model.js');
const APIService = Scope.import('services/api-service.js');
const customer = 'bertplantagie';
const product = 'blake_joni_tara';

Scope.data.productModel = new ProductModel();
Scope.data.setup = {};
Scope.data.errorMessage = null;
Scope.data.groupsOrder = [
  'models',
  'formations',
  'dimensions',
  'finishes',
  'chassis',
  'materialtypes',
  'surfaces',
  'accessories',
  'options',
  'arms',
  'stitchings',
  'zippers',
  'piping',
  'buttons',
  'miylabel'
];

console.info(Scope.data.productModel);
console.info(Scope.data);

Scope.data.navConfig = {
  lock: false
};

view.config.cleanContainer = true;
view.init({
  class: 'interface',
  children: [
    {
      tag: 'link',
      rel: 'stylesheet',
      href: '<>data.spriteSheetURL'
    },
    {
      tag: 'main',
      class: 'view-panel',
      children: [
        {
          id: 'main-view',
          class: 'view',
          inputs: {
            setup: '<>data.productModel.setup'
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
            activeGroup: '<>data.productModel.activeGroup.id',
            groupsOrder: '<>data.groupsOrder'
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

              $if: '<>data.errorMessage',
              text: '<>data.errorMessage'
            },
            {
              tag: 'h2',
              animations: {
                enter: {
                  sequence: 'list-item',
                  from: {
                    y: -20,
                    opacity: 0
                  },
                  to: {
                    y: 0,
                    opacity: 1
                  },
                  duration: .5
                },
                leave: {
                  parent: 'list-item',
                  sequence: 'section-title-sequence',
                  to: {
                    height: 0,
                    opacity: 0,
                    clearProps: 'all'
                  },
                  duration: 1
                }
              },
              class: 'active-section-title',
              $if: '<>data.productModel.activeGroup.id',
              text: [
                'data.productModel.activeGroup.id',
                function (id) {
                  return id ? this.data.title = id : this.data.title;
                }
              ]
            },
            {
              class: 'options-list',
              module: {
                url: 'modules/options-bar/index.js'
              },
              inputs: {
                blacklist: '<>data.productModel.blacklist',
                thumbnail: '<>data.productModel.images.thumbnail',
                setup: '<>data.productModel.setup',
                group: '<>data.productModel.activeGroup',
                groupsOrder: '<>data.groupsOrder',
                navConfig: '<>data.navConfig'
              },
              on: {
                'choice-select': choiceSelect
              }
            }
          ]
        }
      ]
    }
  ]
});
view.renderingFlow.nextAction(function () {
  Scope.data.spriteSheetURL = APIService.getSpriteSheetURL(50, 50);
  fetch('https://integrated-configurator-clientapi-accept.3dimerce.mybit.nl/' + customer + '/' + product).then(function (response) {
    response.json().then(function (response) {
      Scope.data.productModel.init('in3808', response);
    });
  }).catch(function (error) {
    Scope.data.errorMessage = 'Sorry! Failed To load data :(';
  });
});

function groupSelect(event) {
  if (Scope.data.navConfig.lock) {
    return;
  }

  Scope.data.navConfig.lock = true;

  const activeGroup = Scope.data.productModel.activeGroup;
  if (activeGroup && activeGroup.id === event.detail.groupId) {
    Scope.data.productModel.setActiveGroupById(null);
  } else {
    Scope.data.productModel.setActiveGroupById(event.detail.groupId);
  }
}

function optionSelect(event) {
  Scope.data.productModel.setActiveOptionById(event.detail.optionId);
}

let requestThrottle;

function choiceSelect(event) {
  const newSetup = Object.assign({}, Scope.data.productModel.setup);
  newSetup[event.detail.id] = event.detail.value;
  Scope.data.productModel.setup[event.detail.id] = event.detail.value;

  clearTimeout(requestThrottle);
  requestThrottle = setTimeout(function () {
    APIService.verifySetup(newSetup).then(function (data) {
      Scope.data.productModel.blacklist = data.blacklist;
      Scope.data.productModel.setup = data.setup;
      Scope.data.productModel.images = data.images;
    });
  }, 100);
}