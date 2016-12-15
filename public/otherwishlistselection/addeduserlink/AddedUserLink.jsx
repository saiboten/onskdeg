// @flow

import React from 'react';
import { Link } from 'react-router';

const debug = require('debug')('AddedUserLink');
const DragSource = require('react-dnd').DragSource;


require('./addeduserlink.css');

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const cardSource = {
  beginDrag(props) {
    debug('beginDrag');

    const item = {
      email: props.el.email,
    };
    return item;
  },

  endDrag(props, monitor, component) {
    debug('endDrag');

    if (!monitor.didDrop()) {
      return;
    }

    // When dropped on a compatible target, do something
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    debug('Drag has ended. And we dropped it on something nice', item, dropResult);
  },
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  debug('collect');

  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
  };
}

class AddedUserLink extends React.Component {

  render() {
    const isDragging = this.props.isDragging;
    const connectDragSource = this.props.connectDragSource;

    return connectDragSource(
      <div className="added-user-link__wrapper">
        <Link className="added-user-link__link button" to={`/other/${this.props.el.uid}`}>{this.props.el.name}</Link>
      </div>);
  }
}

AddedUserLink.propTypes = {
  isDragging: React.PropTypes.bool,
  connectDragSource: React.PropTypes.object,
  el: React.PropTypes.object,
};

module.exports = DragSource('deleteUser', cardSource, collect)(AddedUserLink);
