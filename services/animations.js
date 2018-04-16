Scope.exports = {
  barAnimation: {
    sequence: 'bar',
    enter: {
      from: {
        height: 0
      },
      to: {
        height: function (val, node) {
          const firstLI = node.querySelector('li');
          return firstLI ? firstLI.scrollHeight : node.scrollHeight;
        }
      },
      duration: .4
    },
    leave: {
      from: {
        height: function (val, node) {
          return node.offsetHeight;
        }
      },
      to: {
        height: 0
      },
      duration: 1.3
    }
  },
  groupsAnimation: {
    enter: {
      sequence: 'groups',
      from: {
        scale: 0
      },
      to: {
        scale: 1
      },
      position: '-=.25',
      duration: .3
    },
    leave: {
      to: {
        scale: 0
      },
      duration: .2
    }
  },
  choiceItemAnimation: {
    config: {
      leaveWithParent: true,
      enterWithParent: true
    },
    enter: {
      parent: 'list-item',
      sequence: 'choice-items',
      from: {
        x: 20,
        opacity: 0
      },
      to: {
        x: 0,
        opacity: 1
      },
      position: '-=.15',
      duration: .3
    },
    leave: {
      parent: 'list-item',
      to: {
        opacity: 0,
        scale: 0.9
      },
      duration: .2
    }
  }
};