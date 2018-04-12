/* Galaxy, Galaxy.Scope */

const inputs = Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');
const animations = Scope.import('/imerce-viewer/services/animations.js');
const utils = Scope.import('/imerce-viewer/services/utils.js');

Scope.data.activeOptionId = null;
Scope.data.setupTimestamp = new Date().getTime();

function isActive(id, value) {
  return inputs.setup[id] === value;
}

const observer = new Galaxy.Observer(inputs);
observer.on('setup', function () {
  Scope.data.setupTimestamp = new Date().getTime();
});

observer.on('group', function () {
  arguments;
});

view.init([
  {
    tag: 'main',
    children: {
      tag: 'article',
      class: 'option-item',
      renderConfig: {
        domManipulationOrder: 'cascade'
      },
      animations: {
        enter: {
          parent: 'bar',
          sequence: 'list-item',
          from: {
            y: 38,
            opacity: 0
          },
          to: {
            y: 0,
            opacity: 1
          },
          position: '-=.24',
          chainToParent: true,
          duration: .3
        },
        leave: {
          sequence: 'list-item',
          to: {
            y: -38,
            opacity: 0
          },
          position: '-=.14',
          chainToParent: true,
          duration: .2
        }
      },
      $for: {
        data: '<>inputs.group.data',
        as: 'option'
      },
      children: [
        {
          tag: 'h3',
          text: '<>option.id'
        },
        {
          tag: 'section',
          children: [
            {
              class: 'choice-item',
              $for: {
                data: '<>option.choices',
                as: 'choice'
              },
              children: [
                {
                  tag: 'button',
                  inputs: {
                    optionId: '<>option.id',
                    choiceId: '<>choice.id'
                  },
                  class: {
                    active: [
                      'option.id',
                      'choice.id',
                      'data.setupTimestamp',
                      function (optionId, choiceId) {
                        return isActive('option:' + optionId, choiceId);
                      }
                    ]
                  },
                  text: '<>choice.id',
                  on: {
                    click: function () {
                      const event = new CustomEvent('choice-select', {
                        detail: {
                          id: 'option:' + this.inputs.optionId,
                          value: this.inputs.choiceId
                        }
                      });
                      view.broadcast(event);
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  }
]);