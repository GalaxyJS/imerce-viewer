/* Galaxy, Galaxy.Scope */

const Animations = Scope.import('/imerce-viewer/services/animations.js');
const APIService = Scope.import('services/api-service.js');
const ActiveStateIndicator = Scope.import('services/extras.js');

const inputs = Scope.import('galaxy/inputs');
const view = Scope.import('galaxy/view');

const observer = new Galaxy.Observer(inputs);
observer.on('setup', function () {
  ActiveStateIndicator.update(Scope);
});

observer.on('thumbnail', function () {
  // ActiveStateIndicator.update(Scope);
});

// debugger;
function broadcastChoiceSelectEvent() {
  const event = new CustomEvent('choice-select', {
    detail: {
      id: 'option:' + this.inputs.optionId,
      value: this.inputs.choiceId
    }
  });

  view.broadcast(event);
  Scope.data.notifyActiveState = new Date().getTime();
}

isActiveChoiceItem.watch = ['option.id', 'choice.id', 'inputs.setup'];

function isActiveChoiceItem(optionId, choiceId) {
  return inputs.setup['option:' + optionId] === choiceId;
}

getAllowedOptions.watch = ['inputs.group.data.changes', 'inputs.blacklist'];

function getAllowedOptions(changes, blacklist) {
  if (changes && changes.original) {
    changes.params = changes.original.filter(function (item) {
      return !blacklist.hasOwnProperty('option:' + item.id);
    });
  }

  return changes || new Galaxy.View.ArrayChange();
}

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
        data: getAllowedOptions,
        as: 'option',
        trackBy: function (item) {
          return item.id;
        }
      },
      children: [
        {
          tag: 'h3',
          text: '<>option.id'
        },
        {
          tag: 'section',
          children: [
            ActiveStateIndicator.schema,
            {
              class: {
                'choice-item': true,
                active: isActiveChoiceItem
              },
              animations: Animations.choiceItemAnimation,
              lifecycle: {
                rendered: function () {
                  ActiveStateIndicator.update(Scope);
                }
              },
              $for: {
                data: [
                  'option.choices.changes',
                  'option.id',
                  'inputs.blacklist',
                  function (changes, id, blacklist) {
                    if (changes && changes.original) {
                      changes.params = changes.original.filter(function (item) {
                        return !blacklist.hasOwnProperty('choice:' + id + '+' + item.id);
                      });

                      // const newListId = changes.params.reduce(function (all, item) {
                      //   return all + item.id;
                      // }, ',');
                      //
                      // if (this.data.listId === newListId) {
                      //   return null;
                      // }
                      // this.data.listId = newListId;
                    }

                    return changes;
                  }
                ],
                as: 'choice',
                trackBy: function (item, index) {
                  return item ? item.id : index;
                }
              },
              inputs: {
                optionId: '<>option.id',
                choiceId: '<>choice.id'
              },
              on: {
                click: broadcastChoiceSelectEvent
              },
              children: [
                {
                  class: {
                    icon: true,
                    loaded: '<>this.loaded'
                  },
                  style: {
                    backgroundImage: [
                      'option.id',
                      'choice.id',
                      function (oid, cid) {
                        const _this = this;

                        const url = inputs.thumbnail['option:' + oid + '+' + cid];
                        if (!url) {
                          return null;
                        }

                        const width = this.node.offsetWidth || 100;
                        const height = this.node.offsetHeight || 100;
                        const iconURL = APIService.getThumbnailURL(inputs.thumbnail['option:' + oid + '+' + cid], width, height);

                        const img = new Image(width, height);
                        img.onload = function () {
                          _this.data.loaded = true;
                        };
                        img.src = iconURL;

                        return 'url("' + iconURL + '")';
                      }
                    ]
                  }
                },
                {
                  tag: 'label',
                  text: '<>choice.id'
                }
              ]
            }
          ]
        }
      ]
    }
  }
]);