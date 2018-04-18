const view = Scope.import('galaxy/view');
const inputs = Scope.import('galaxy/inputs');
const APIService = Scope.import('services/api-service.js');

const observer = new Galaxy.Observer(inputs);
observer.on('setup', function (newSetup) {
  renderImage(newSetup);
});

function renderImage(newSetup) {
  Scope.data.newImage = false;
  const mainView = view.container.node;
  const url = APIService.getImageURL(newSetup, mainView.offsetWidth, mainView.offsetHeight);

  if (url === Scope.data.imageURL) {
    return;
  }

  const img = new Image();
  img.onload = function () {
    Scope.data.imageURL = url;
    Scope.data.newImage = true;
    addImage(Scope.data.imageURL);
  };
  img.onerror = function (event) {
    console.error(event)
  };
  img.src = url;
}

let oldNode;

function addImage(url) {
  if (oldNode) {
    oldNode.destroy();
  }
  oldNode = view.createNode({
    class: 'image',
    animations: {
      enter: {
        from: {
          opacity: 0
        },
        to: {
          opacity: 1,
          clearProps: ''
        },
        duration: .4
      },
      leave: {
        to: {
          opacity: 1
        },
        duration: 1
      }
    },
    style: {
      backgroundImage: 'url("' + url + '")'
    }
  });
}

Scope.data.imageURL = null;
Scope.data.oldImageURL = null;
Scope.data.newImage = false;

view.init();
view.renderingFlow.nextAction(function () {
  if (inputs.setup && Scope.data.imageURL === null) {
    renderImage(inputs.setup);
  }
});
