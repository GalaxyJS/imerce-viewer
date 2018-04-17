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

let newGroupIndex = null;
let oldGroupIndex = null;

itemsAnimation = {
  enter: {
    parent: 'bar',
    sequence: 'list-item',
    from: function (node) {
      // in the case where no group is selected, then oldGroupIndex and newGroupIndex are the same
      if (oldGroupIndex === null) {
        oldGroupIndex = newGroupIndex;
      }

      let x = 38;
      let y = 0;
      if (newGroupIndex < oldGroupIndex) {
        x = -38;
      }

      if (newGroupIndex === oldGroupIndex) {
        x = 0;
        y = -38;
      }

      return {
        x: x,
        y: y,
        opacity: 0
      }
    },
    to: {
      x: 0,
      y: 0,
      opacity: 1
    },
    position: '-=.24',
    chainToParent: true,
    duration: .3
  },
  leave: {
    sequence: 'list-item',
    to: function () {
      if (oldGroupIndex === null) {
        oldGroupIndex = newGroupIndex;
      }

      let x = -38;
      let y = 0;
      if (newGroupIndex < oldGroupIndex) {
        x = 38;
      }

      if (newGroupIndex === oldGroupIndex) {
        x = 0;
        y = -38;
      }

      return {
        x: x,
        y: y,
        opacity: 0
      }
    },
    position: '-=.14',
    chainToParent: true,
    duration: .2
  }
};

observer.on('group', function () {
  if (inputs.group) {
    newGroupIndex = inputs.groupsOrder.indexOf(inputs.group.id);
  } else {
    newGroupIndex = null;
    oldGroupIndex = null;
  }
});

let resizeThrottle;
window.addEventListener('resize', function () {
  clearTimeout(resizeThrottle);
  resizeThrottle = setTimeout(function () {
    Scope.data.notifyActiveState = new Date().getTime();
  }, 200);
});

isActiveChoiceItem.watch = ['option.id', 'choice.id', 'inputs.setup'];

function isActiveChoiceItem(optionId, choiceId, setup) {
  return setup['option:' + optionId] === choiceId;
}

isActiveColorItem.watch = ['surface.id', 'material.id', 'color.id', 'inputs.setup'];

function isActiveColorItem(surfaceId, materialId, colorId, setup) {
  return setup['surface:' + surfaceId] === materialId + '+' + colorId;
}

getAllowedOptions.watch = ['inputs.group.data.changes', 'inputs.blacklist'];

function getAllowedOptions(changes, blacklist) {
  if (changes && changes.original) {
    const params = changes.original.filter(function (item) {
      return !blacklist.hasOwnProperty('option:' + item.id);
    });

    changes.params = params.filter(function (item) {
      return item.hasOwnProperty('choices');
    })
  }

  return changes || new Galaxy.View.ArrayChange();
}

getAllowChoices.watch = ['option.choices.changes', 'option.id', 'inputs.blacklist'];

function getAllowChoices(changes, optionId, blacklist) {
  if (changes && changes.original) {
    changes.params = changes.original.filter(function (item) {
      return !blacklist.hasOwnProperty('choice:' + optionId + '+' + item.id);
    });
  }

  return changes;
}

getAllowedSurfaces.watch = ['inputs.group.data.changes', 'inputs.blacklist'];

function getAllowedSurfaces(changes, blacklist) {
  if (changes && changes.original) {
    const params = changes.original.filter(function (item) {
      return !blacklist.hasOwnProperty('surface:' + item.id);
    });

    changes.params = params.filter(function (item) {
      return item.hasOwnProperty('materials');
    });
  }

  return changes || new Galaxy.View.ArrayChange();
}

getAllowedMaterials.watch = ['surface.materials.changes', 'surface.id', 'inputs.blacklist'];

function getAllowedMaterials(changes, surfaceId, blacklist) {
  if (changes && changes.original) {
    changes.params = changes.original.filter(function (item) {
      return !blacklist.hasOwnProperty('material:' + surfaceId + '+' + item.id);
    });
  }

  return changes;
}

getMaterialColors.watch = ['material.id'];

function getMaterialColors(materialId) {
  const allMaterials = this.inputs.materials;
  const material = allMaterials.filter(function (material) {
    return material.id === materialId;
  })[0];

  return material ? material.colors.changes : new Galaxy.View.ArrayChange();
}

function trackById(item) {
  return item.id;
}

view.init([
  {
    tag: 'main',
    lifecycle: {
      postEnterAnimations: function () {
        oldGroupIndex = newGroupIndex;
      }
    },
    children: [
      {
        tag: 'article',
        class: 'option-item',
        renderConfig: {
          domManipulationOrder: 'cascade'
        },
        animations: itemsAnimation,
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
                  data: getAllowChoices,
                  as: 'choice',
                  trackBy: trackById
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
      },
      {
        tag: 'article',
        class: 'option-item surface',
        renderConfig: {
          domManipulationOrder: 'cascade'
        },
        animations: itemsAnimation,
        $for: {
          data: getAllowedSurfaces,
          as: 'surface',
          trackBy: trackById
        },
        children: [
          {
            tag: 'h3',
            text: '<>surface.id'
          },
          {
            tag: 'section',
            children: [
              {
                tag: 'section',
                children: [
                  {
                    class: 'material-item',
                    animations: Animations.choiceItemAnimation,
                    lifecycle: {
                      rendered: function () {
                        ActiveStateIndicator.update(Scope);
                      }
                    },
                    $for: {
                      data: getAllowedMaterials,
                      as: 'material',
                      trackBy: trackById
                    },
                    children: [
                      {
                        tag: 'label',
                        text: '<>material.id'
                      },
                      {
                        tag: 'section',
                        children: {
                          tag: 'span',
                          $for: {
                            data: [
                              '<>material.colors.changes',
                              function (colors) {
                                if (colors) {
                                  colors.params = colors.original;
                                  return colors
                                }

                                return new Galaxy.View.ArrayChange();
                              }
                            ],
                            as: 'color'
                          },
                          class: {
                            'color-item': true,
                            active: isActiveColorItem
                          },
                          inputs: {
                            surfaceId: '<>surface.id',
                            materialId: '<>material.id',
                            colorId: '<>color.id'
                          },
                          on: {
                            click: broadcastColorSelectEvent
                          },
                          children: [
                            {
                              class: 'icon sprite-color',
                              material: '<>material.id',
                              color: '<>color.id'
                            }
                          ]
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]);

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

function broadcastColorSelectEvent() {
  const event = new CustomEvent('choice-select', {
    detail: {
      id: 'surface:' + this.inputs.surfaceId,
      value: this.inputs.materialId + '+' + this.inputs.colorId
    }
  });

  view.broadcast(event);
  Scope.data.notifyActiveState = new Date().getTime();
}