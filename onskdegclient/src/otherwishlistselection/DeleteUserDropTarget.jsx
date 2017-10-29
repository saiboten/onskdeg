// @flow

import React from 'react';
import { any, bool } from 'prop-types';

const DropTarget = require('react-dnd').DropTarget;
const debug = require('debug')('DeleteUserDropTarget');

require('./deleteuserdroptarget.css');

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const deleteTarget = {

  drop(props, monitor, component) {
    debug('drop');
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    const item = monitor.getItem();

    debug('Dropped! Deleting user: ', item.email);
    props.delete(item.email);
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  debug('collect');

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

class DeleteUserDropTarget extends React.Component {
  componentWillReceiveProps(nextProps) {
    debug('componentWillReceiveProps');

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
  }

  render() {
    // These props are injected by React DnD,
    // as defined by your `collect` function above:
    const isOver = this.props.isOver;
    const canDrop = this.props.canDrop;
    const connectDropTarget = this.props.connectDropTarget;

    return connectDropTarget(
      <div className="border space">
        <p>Dra en bruker ned her for å slette brukeren</p>
      </div>);
  }
}

DeleteUserDropTarget.propTypes = {
  isOver: bool,
  canDrop: bool,
  isOverCurrent: bool,
  connectDropTarget: any
};

export default DropTarget('deleteUser', deleteTarget, collect)(DeleteUserDropTarget);
