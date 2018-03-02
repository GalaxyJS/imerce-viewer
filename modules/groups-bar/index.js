/* Galaxy, Galaxy.Scope */

Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');

Scope.data.activeGroupId = null;

view.init([
  {
    tag: 'ul',
    children: {
      tag: 'li',
      $for: {
        data: '<>inputs.data',
        as: 'group'
      },
      children: [
        {
          tag: 'button',
          text: '<>group.id',
          inputs: {
            groupId: '<>group.id'
          },
          class: {
            active: [
              'group.id',
              'data.activeGroupId',
              function (id, activeGroupId) {
                return id === activeGroupId;
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