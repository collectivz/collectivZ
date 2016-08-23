import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import App from '../layout/App.jsx'

export default createContainer(() => {
  const userSub = Meteor.subscribe('user');

  return {
    user: Meteor.user(),
    loading: !userSub.ready(),
  };
}, App);