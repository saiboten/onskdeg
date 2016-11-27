var React = require('react');
var DropTarget = require('react-dnd').DropTarget;
var debug = require('debug')('DeleteUserDropTarget');
require('./deleteuserdroptarget.css');

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
var deleteTarget = {

  drop: function (props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    var item = monitor.getItem();

    debug("Dropped! Deleting user: ", item.email);
    props.delete(item.email);
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

var DeleteUserDropTarget = React.createClass({
  componentWillReceiveProps: function (nextProps) {
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
    }

    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
    }

    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  },

  render: function () {

    // These props are injected by React DnD,
    // as defined by your `collect` function above:
    var isOver = this.props.isOver;
    var canDrop = this.props.canDrop;
    var connectDropTarget = this.props.connectDropTarget;

    return connectDropTarget(
      <div className="border space">
        <p>Dra en bruker ned her for å slette brukeren</p>
      </div>
    );
  }
});

module.exports = DropTarget("deleteUser", deleteTarget, collect)(DeleteUserDropTarget);
