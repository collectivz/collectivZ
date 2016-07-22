import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Channels = new Mongo.Collection('channels');
export const Messages = new Mongo.Collection('messages');

let id;

if (Meteor.isServer) {
  Meteor.startup(() => {

    if (Channels.find().count() === 0) {
      id = Channels.insert({
        type: 'guilde',
        sourceId: null,
        sourcePreview: null,
        preview: {
          name: 'Collectivz',
          description: 'Just a team for now'
        },
      });
    }

    if (Messages.find().count() === 0) {
      let chan = Channels.findOne({ _id: id });
      console.log(chan);
      // Messages.insert({
      //
      // }),
    }
  });
}
