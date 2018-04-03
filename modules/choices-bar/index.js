/* Galaxy, Galaxy.Scope */

Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');
const animations = Scope.import('/imerce-viewer/services/animations.js');
const utils = Scope.import('/imerce-viewer/services/utils.js');

Scope.data.activeChoiceId = null;

view.init([
  {
    tag: 'ul',
    animations: animations.barAnimation,
    $if: utils.whenListIsNotEmpty('inputs.option.choices'),
    children: {
      tag: 'li',
      $for: {
        data: '<>inputs.option.choices',
        as: 'choice'
      },
      children: [
        {
          tag: 'button',
          inputs: {
            choiceId: '<>choice.id'
          },
          text: '<>choice.id',
          class: {
            active: [
              'choice.id',
              'data.activeChoiceId',
              function (id, activeChoiceId) {
                return id === activeChoiceId;
              }
            ]
          },
          on: {
            click: function () {
              Scope.data.activeChoiceId = this.inputs.choiceId;

              const event = new CustomEvent('choice-select', {
                // bubbles: true,
                detail: {
                  groupId: Scope.data.activeChoiceId
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