/* Galaxy, Galaxy.Scope */

Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');

Scope.data.activeOptionId = null;
console.info(Scope.inputs)

view.init([
  {
    tag: 'ul',
    animations: {
      enter: {
        from: {
          height: 0
        },
        to: {
          height: 38
        },
        duration: 1
      }
    },
    // $if: [
    //   'inputs.group',
    //   function (ao) {
    //     return ao ? ao.data.length : false;
    //   }
    // ],
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
              'inputs.activeOption',
              function (id, activeOption) {
                return activeOption ? id === activeOption.id : false;
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