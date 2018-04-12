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
  }
};