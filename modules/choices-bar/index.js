/* Galaxy, Galaxy.Scope */

Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');

Scope.data.activeChoiceId = null;

view.init([
  {
    tag: 'ul',
    children: {
      tag: 'li',
      $for: {
        data: '<>inputs.option.choices',
        as: 'choice'
      },
      children: [
        {
          tag: 'button',
          text: '<>choice.id',
          inputs: {
            choiceId: '<>choice.id'
          },
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