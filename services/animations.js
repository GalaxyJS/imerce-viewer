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
      duration: .3
    }
  }
};