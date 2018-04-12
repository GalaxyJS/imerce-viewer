const view = Scope.import('galaxy/view');
const inputs = Scope.import('galaxy/inputs');

const observer = new Galaxy.Observer(inputs);
observer.onAll(function () {

});

view.init([
  {
    class: 'image',
    // text: '<>inputs.imageURL',
    style: {
      backgroundImage: '<>inputs.imageURL'
    }
  }
]);