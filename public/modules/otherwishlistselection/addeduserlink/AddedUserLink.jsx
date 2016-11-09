var React = require('react');
var DragSource = require('react-dnd').DragSource;
import {Link} from 'react-router';
var debug = require('debug')('AddedUserLink');
require('./addeduserlink.css');
/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
var cardSource = {
    beginDrag: function(props) {
        // Return the data describing the dragged item
        var item = {
            email: props.el.email
        };
        return item;
    },

    endDrag: function(props, monitor, component) {
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
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}

var AddedUserLink = React.createClass({

    render() {

        var isDragging = this.props.isDragging;
        var connectDragSource = this.props.connectDragSource;

        return connectDragSource(
            <div className="added-user-link__wrapper"><Link className="added-user-link__link button" to={"/other/" + this.props.el.uid}>{this.props.el.name}</Link></div>
        );
    }
})

module.exports = DragSource("deleteUser", cardSource, collect)(AddedUserLink);
