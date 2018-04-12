/* Galaxy, Galaxy.Scope */

const view = Scope.import('galaxy/view');
const ProductModel = Scope.import('services/product-model.js');
const customer = 'bertplantagie';
const product = 'blake_joni_tara';

Scope.data.productModel = new ProductModel();
Scope.data.setup = {};
Scope.data.errorMessage = null;
// Scope.data.imageURL = null;

// fetch('https://integrated-configurator-clientapi-accept.3dimerce.mybit.nl/iwc/in3808').then(function (response) {
fetch('https://integrated-configurator-clientapi-dev.3dimerce.mybit.nl/' + customer + '/' + product).then(function (response) {
  response.json().then(function (data) {
    Scope.data.productModel.init('in3808', data);
  });
}).catch(function (error) {
  Scope.data.errorMessage = 'Sorry! Failed To load data :('
});

function verifySetup(setup) {
  const url = getSetupURL(setup);
  return fetch(url).then(function (response) {
    return response.json();
  });
}

console.info(Scope.data.productModel);

const refreshView = function () {

};

function queryBuilder(params) {
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  return query;
}

function getSetupURL(setup) {
  const path = [customer, product, 'setup'].join('/');

  return getURL(path, setup);
}

function getImageURL(setup, width, height, extension) {
  const request = Object.assign({}, setup);

  const query = JSON.stringify(request);
  const hash = CryptoJS.SHA256(query);

  const pixelRatio = window.devicePixelRatio || 1;
  const resolution = [width * pixelRatio, height * pixelRatio].join('x');

  const image = [hash, resolution].join('-');
  const filename = [image, extension || 'jpg'].join('.');

  const path = [customer, product, filename].join('/');

  return getURL(path, request);
}

function getURL(path, params) {
  const query = queryBuilder(params);
  const uri = ['https://integrated-configurator-clientapi-dev.3dimerce.mybit.nl', path].join('/');

  return [uri, query].join('?');
}

console.info(Scope.data);
view.config.cleanContainer = true;
view.init({
  class: 'interface',
  children: [
    {
      tag: 'main',
      children: [
        {
          id: 'main-view',
          class: 'view',
          inputs: {
            imageURL: '<>data.imageURL',
            refresh: refreshView
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

              $if: '<>data.errorMessage',
              text: '<>data.errorMessage'
            },
            {
              tag: 'h2',
              animations: {
                enter: {
                  sequence: 'list-item',
                  from: {
                    x: -20,
                    opacity: 0
                  },
                  to: {
                    x: 0,
                    opacity: 1
                  },
                  duration: .5
                },
                leave: {
                  to: {
                    height: 0,
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
                setup: '<>data.productModel.setup',
                group: '<>data.productModel.activeGroup'
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

function choiceSelect(event) {
  const newSetup = Object.assign({}, Scope.data.productModel.setup);
  newSetup[event.detail.id] = event.detail.value;

  verifySetup(newSetup).then(function (data) {
    Scope.data.productModel.blacklist = data.blacklist;
    Scope.data.productModel.setup = data.setup;
    const mainView = view.container.querySelector('#main-view');

    const url = getImageURL(newSetup, mainView.offsetWidth, mainView.offsetHeight);
    Scope.data.imageURL = 'url("' + url + '")';
  });

}