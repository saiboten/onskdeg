let debug = require('debug')('AddedUserLink');
let DragSource = require('react-dnd').DragSource;

import React from 'react';
import {Link} from 'react-router';

require('./addeduserlink.css');

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
let cardSource = {
    beginDrag: function(props) {
        debug("beginDrag");

        var item = {
            email: props.el.email
        };
        return item;
    },

    endDrag: function(props, monitor, component) {
        debug("endDrag");

        if (!monitor.didDrop()) {
            return;
        }

        // When dropped on a compatible target, do something
        var item = monitor.getItem();
        var dropResult = monitor.getDropResult();
        debug("Drag has ended. And we dropped it on something nice", item, dropResult);
    }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
    debug("collect");

    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}

let AddedUserLink = React.createClass({

    render() {

        let isDragging = this.props.isDragging;
        let connectDragSource = this.props.connectDragSource;

        return connectDragSource(
            <div className="added-user-link__wrapper">
                <Link className="added-user-link__link button" to={"/other/" + this.props.el.uid}>{this.props.el.name}</Link>
            </div>
        );
    }
})

module.exports = DragSource("deleteUser", cardSource, collect)(AddedUserLink);
