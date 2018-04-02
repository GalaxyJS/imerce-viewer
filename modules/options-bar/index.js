/* Galaxy, Galaxy.Scope */

Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');
const animations = Scope.import('/imerce-viewer/services/animations.js');
const utils = Scope.import('/imerce-viewer/services/utils.js');

Scope.data.activeOptionId = null;
console.info('ob', Scope.inputs);

view.init([
  {
    tag: 'ul',
    animations: animations.barAnimation,
    $if: utils.whenListIsNotEmpty('inputs.agroup.data'),
    children: {
      tag: 'li',
      animations: {
        enter: {
          parent: 'bar',
          sequence: 'list-item',
          from: {
            y: 38
          },
          to: {
            y: 0
          },
          position: '-=.1',
          chainToParent: true,
          duration: .3
        },
        leave: {
          sequence: 'list-item',
          to: {
            y: -38
          },
          position: '-=.1',
          chainToParent: true,
          duration: .2
        },
      },
      $for: {
        data: '<>inputs.agroup.data',
        as: 'option'
      },
      children: [
        {
          inputs: {
            optionId: '<>option.id'
          },
          tag: 'button',
          text: '<>option.id',
          class: {
            active: [
              'option.id',
              'inputs.activeOptionId',
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