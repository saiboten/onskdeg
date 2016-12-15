// @flow
const firebase = require('./firebase');

const provider = new firebase.auth.FacebookAuthProvider();
module.exports = provider;
