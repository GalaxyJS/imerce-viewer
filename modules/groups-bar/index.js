/* Galaxy, Galaxy.Scope */

Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');
const animations = Scope.import('/imerce-viewer/services/animations.js');
const utils = Scope.import('/imerce-viewer/services/utils.js');

const exclusionList = [
  'cameras'
];

Scope.data.activeGroupId = null;

getOrderedGroups.watch = ['inputs.data.changes', 'inputs.groupsOrder'];

function getOrderedGroups(changes, groupsOrder) {
  if (changes) {
    changes.params = changes.original.filter(function (group) {
      return exclusionList.indexOf(group.id) === -1;
    });
    changes.params.sort(function (a, b) {
      return groupsOrder.indexOf(a.id) - groupsOrder.indexOf(b.id);
    });

    return changes;
  }

  return new Galaxy.View.ArrayChange();
}

// let res;
// const p = new Promise(function (resolve) {
//   res = resolve;
// });
//
// p.then(function () {
//   alert('asd');
// });
//
// res();
// setTimeout(function () {
//   alert('setTimeout');
// },0);

view.init([
  {
    tag: 'ul',
    children: {
      tag: 'li',
      animations: animations.groupsAnimation,
      $for: {
        data: getOrderedGroups,
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