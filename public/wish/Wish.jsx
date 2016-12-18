// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import firebase from '../firebase/firebase';

const storageRef = firebase.storage().ref();

const debug = require('debug')('Wish');

require('./wish.css');

class Wish extends React.Component {

  constructor(props) {
    super();
    this.state = {
      edit: false,
      text: props.wish.name,
      confirm: false,
      image: '',
    };
    this.click = this.click.bind(this);
    this.focusLost = this.focusLost.bind(this);
    this.updateText = this.updateText.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.cancel = this.cancel.bind(this);
    this.deleteConfirmed = this.deleteConfirmed.bind(this);
    this.onDrop = this.onDrop.bind(this);
    debug('props: ', props);

    if (props.wish.image) {
      storageRef.child(props.wish.image).getDownloadURL().then((url) => {
        debug('url: ', url);
        this.setState({
          image: url,
        });
      });
    }
  }

  componentWillReceiveProps(nextProps /* : any */) {
    this.setState({
      text: nextProps.wish.name,
      confirm: nextProps.wish.confirm,
    });
  }

  componentDidUpdate() {
    if (this.input) {
      this.input.focus();
    }
  }

  onDrop(acceptedFiles, rejectedFiles) {
    debug('Looks like I dropped something', acceptedFiles, rejectedFiles);

    const imageName = `${this.props.wish.id}.${acceptedFiles[0].name.split('.')[1]}`;

    const uploadTask = storageRef.child(imageName)
    .put(acceptedFiles[0]);

    uploadTask.on('state_changed', (snapshot) => {
    }, (error) => {
      debug('Error. Wups.');
    }, () => {
      debug('Success!');
      storageRef.child(imageName).getDownloadURL().then((url) => {
        debug('url: ', url);
        this.setState({
          image: url,
        });
      });
      this.props.addImage(this.props.wish, imageName);
    });
  }

  updateText(e /* : Event */) {
    this.setState({
      text: e.target.value,
    });
  }

  deleteItem(e /* : Event */) {
    this.setState({
      confirm: true,
    });
  }

  cancel(e /* : Event */) {
    this.setState({
      confirm: false,
    });
  }

  deleteConfirmed(e /* : Event */) {
    this.props.delete(this.props.wish.id);
  }

  focusLost() {
    this.setState({
      edit: false,
    });
    this.props.update({
      name: this.state.text,
      id: this.props.wish.id,
      checkedby: this.props.wish.checkedby,
      checked: this.props.wish.checked,
      image: this.props.wish.image,
    });
  }

  click() {
    this.setState({
      edit: true,
    });
  }

  render() {
    const image = this.props.wish.image ? (<img className="wish__image" alt={'Awesome'} src={this.state.image} />) : '';

    const deleteWish = this.state.confirm ?
    (
      <div className="flex-row space-between right">
        <button className="button" onClick={this.cancel}>Avbryt</button>
        <button className="button wish__confirm-delete-button" onClick={this.deleteConfirmed}>Slett</button>
      </div>)
      :
      (
        <div className="flex-row space-between right">
          <button className="wish__delete-button button" onClick={this.deleteItem}>Slett</button>
          <Dropzone className="wish__wish-dropzone" onDrop={this.onDrop}>
            <button className="button">Bilde</button>
          </Dropzone>
        </div>
);

    const html = this.state.edit ?
    (<textarea
      className="wish__wish-input"
      ref={(c) => { this.input = c; }}
      onBlur={this.focusLost}
      onChange={this.updateText}
      value={this.state.text}
    />
    ) :
    (<div onClick={this.click} className="wish__wish-text">{this.state.text}</div>);
    return (

      <div>
        <div className="wish__wish-listelement">{html}
        </div>

        <div className="wish__wish-listelement flex-row space-between">{deleteWish}
        </div>

        <div className="flex-row space-between">
          {image}
        </div>
        <hr />
      </div>
    );
  }
}

Wish.propTypes = {
  delete: React.PropTypes.func,
  wish: React.PropTypes.object,
  update: React.PropTypes.func,
  addImage: React.PropTypes.func,
};

module.exports = Wish;
