/* Galaxy, Galaxy.Scope */

Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');
const animations = Scope.import('/imerce-viewer/services/animations.js');
const utils = Scope.import('/imerce-viewer/services/utils.js');

Scope.data.activeGroupId = null;

const updateScrollPos = function (node, e) {
  Scope.data.scrollLeft = (clickX - e.pageX);
  // console.log(clickX -e.pageX, node.scrollLeft);
};

let clicked;
let clickX;
console.log(Scope)
view.init([
  {
    tag: 'ul',
    // scrollLeft: '<>data.scrollLeft',
    // on: {
    //   'mousemove': function (e) {
    //     clicked && updateScrollPos(this.node, e);
    //   },
    //   'mousedown': function (e) {
    //     clicked = true;
    //     clickX = e.pageX;
    //   },
    //   'mouseup': function () {
    //     clicked = false;
    //   }
    // },
    // animations: animations.barAnimation,
    // $if: utils.whenListIsNotEmpty('inputs.data'),
    children: {
      tag: 'li',
      animations: animations.groupsAnimation,
      $for: {
        data: '<>inputs.data',
        as: 'group'
      },
      children: [
        {
          inputs: {
            groupId: '<>group.id'
          },
          tag: 'button',
          text: '<>group.id',
          class: {
            active: [
              'group.id',
              'inputs.activeGroup',
              function (id, activeGroup) {
                return id === activeGroup;
              }
            ]
          },
          on: {
            click: function () {
              Scope.data.activeGroupId = this.inputs.groupId;

              const event = new CustomEvent('group-select', {
                // bubbles: true,
                detail: {
                  groupId: Scope.data.activeGroupId
                }
              });
              view.broadcast(event);
            }
          }
        }
      ]
    }
  }
]);