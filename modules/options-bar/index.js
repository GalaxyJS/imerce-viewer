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

observer.on('blacklist', function () {
  arguments;
  // debugger;
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
        data: [
          'inputs.group.data',
          function (data) {
            if (data && data.original) {
              data.params = data.original.filter(function (item) {
                return !inputs.blacklist.hasOwnProperty('option:' + item.id);
              });

              // const newListId = data.params.reduce(function (all, item) {
              //   return all + item.id;
              // }, '');
              //
              // if (this.data.listId === newListId) {
              //   console.info('ignore');
              //   return {};
              // }
              //
              // this.data.listId = newListId;
            }

            return data;
          }
        ],
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
              animations: {
                config: {
                  leaveWithParent: true,
                  enterWithParent: true
                },
                enter: {
                  parent: 'test',
                  from: {
                    x: 30,
                    opacity: 0
                  },
                  to: {
                    x: 0,
                    opacity: 1
                  },
                  duration: .3
                },
                leave: {
                  parent: 'test',
                  to: {
                    opacity: 0,
                    x: -30
                  },
                  duration: .3
                }
              },
              $for: {
                data: [
                  'option.choices',
                  'option.id',
                  'inputs.blacklist',
                  function (data, id) {
                    if (data && data.original) {
                      data.params = data.original.filter(function (item) {
                        return !inputs.blacklist.hasOwnProperty('choice:' + id + '+' + item.id);
                      });

                      const newListId = data.params.reduce(function (all, item) {
                        return all + item.id;
                      }, '');

                      if (this.data.listId === newListId) {
                        return {};
                      }

                      this.data.listId = newListId;
                    }

                    return data;
                  }
                ],
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