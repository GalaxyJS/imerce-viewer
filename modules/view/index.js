const view = Scope.import('galaxy/view');
const inputs = Scope.import('galaxy/inputs');
const APIService = Scope.import('services/api-service.js');

const observer = new Galaxy.Observer(inputs);
observer.on('setup', function (newSetup) {
  const mainView = view.container.node;
  const url = APIService.getImageURL(newSetup, mainView.offsetWidth, mainView.offsetHeight);

  const img = new Image();
  img.onload = function () {
    Scope.data.imageURL = 'url("' + url + '")';
    Scope.data.newImage = true;
  };
  img.src = url;
});

Scope.data.imageURL = null;
Scope.data.oldImageURL = null;
Scope.data.newImage = false;

view.init([
  {
    class: 'image',
    style: {
      backgroundImage: '<>data.oldImageURL'
    }
  },
  {
    class: 'image',
    $if: '<>data.newImage',
    animations: {
      enter: {
        from: {
          opacity: 0
        },
        to: {
          opacity: 1,
          onComplete: function () {
            Scope.data.oldImageURL = Scope.data.imageURL;
            Scope.data.newImage = false;
          }
        },
        duration: .5
      }
    },
    style: {
      backgroundImage: '<>data.imageURL'
    }
  }
]);
