/* Galaxy, Galaxy.Scope */

Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');

Scope.data.activeOptionId = null;
console.info(Scope.inputs)

view.init([
  {
    tag: 'ul',
    children: {
      tag: 'li',
      $for: {
        data: '<>inputs.group.data',
        as: 'option'
      },
      children: [
        {
          tag: 'button',
          text: '<>option.id',
          inputs: {
            optionId: '<>option.id'
          },
          class: {
            active: [
              'option.id',
              'data.activeOptionId',
              function (id, activeOptionId) {
                return id === activeOptionId;
              }
            ]
          },
          on: {
            click: function () {
              Scope.data.activeOptionId = this.inputs.optionId;

              const event = new CustomEvent('option-select', {
                // bubbles: true,
                detail: {
                  optionId: Scope.data.activeOptionId
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