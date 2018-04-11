/* Galaxy, Galaxy.Scope */

Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');
const animations = Scope.import('/imerce-viewer/services/animations.js');
const utils = Scope.import('/imerce-viewer/services/utils.js');

Scope.data.activeGroupId = null;

view.init([
  {
    tag: 'ul',
    animations: animations.barAnimation,
    $if: utils.whenListIsNotEmpty('inputs.data'),
    children: {
      tag: 'li',
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
                console.info(id, activeGroup);
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