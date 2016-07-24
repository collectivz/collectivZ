import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { underscore } from 'meteor/underscore';
import { Chans, Msgs, Guilds } from './collections';

Meteor.methods({
  newMessage(message) {                                   // add a new message in a chan
    if (!this.userId) {                                   // var message contain text, Id
      throw new Meteor.Error('not-logged-in',             // from chan and a type
        'Must be logged in to send message.');
    }

    check(message, {                                      // verify message if he
      text: String,                                       // does contain a text, a chan and a type
      chanId: String,
      type: null || 'sondage'
    });

    message.timestamp = new Date();                       // add a timestamp and a author to him
    message.userId = this.userId;

    Msgs.insert(message);                                 // push into the Db
    },

  editMessage(newText, messageId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to send message.');
    }
    const oldMessage = Msgs.findOne(messageId);
    if (this.userId !== oldMessage.userId) {
      throw new Meteor.Error('not-allowed-to',
      'You can only edit your own messages.');
    }
    Msgs.update(messageId, {$set: { text: newText}});
  },

  newChan(chan, fatherChanId) {                           // create a chan in a guilde
    if (!this.userId) {                                   // log check
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to create a chat.');
    }
                                                          // var chan contain his depth,
    check(fatherChanId, String);                          // and a title
    check(chan, {
      title: String,
      depth: Number,
    });

    if (fatherChanId) {
      if (chan.depth > 1) {
        const fatherChan = Chans.findOne(fatherChanId);
      }
      else {
        const fatherChan = Guilds.findOne(fatherChanId);
      }
      if (!_.contains(fatherChan.privilegedMembers, this.userId)) { // check rights
        throw new Meteor.Error('not-allowed-to',
        'Must have the right to do so.');
      }
    } else {
      throw new Meteor.Error('no-father',                           // check father
      'Every chan should have a father');
    }


    chan.author = this.userId;                                       // add author source, connections, rights
    chan.sourceId = fatherChanId;
    chan.connections = {
      memberCount: 0,
      pollCount: 0,
      challengeCount: 0,
      walletCount: 0,
      chanCount: 0
    };
    chan.privilegedMembers = [];
    chan.privilegedMembers.push(this.userId);
    chan.adhesionRequest = [];

    Chans.insert(chan);                                              // insert in the Db
    fatherChan.connections.chanCount += 1;
    if (chan.depth > 1) {
      Chans.update(chanId, {
        $inc: {'connections.chanCount' : 1}
      });
    }
    else {
      Guilds.update(chanId, {
        $inc: {'connections.chanCount' : 1}
      });
    }

  },

  newGuild(guild) {
    if (!this.userId) {                                   // log check
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to create a guild.');
    }

    check(guild, {                                        // the guild var contain a name
      name: String,                                       // an array of interest
      interest: [String],                                 // and an array of grade available
      gradeAvailable: [String],
    });

    if (Guilds.findOne({name: guild.name}))
    {
      throw new Meteor.Error('already exist',
        'There is already a guild with this name.');
    }

    guild.depth = 0;
    guild.author = this.userId;
    guild.xp = 0;
    guild.level = 0;
    guild.connections = {
      memberCount: 0,
      pollCount: 0,
      challengeCount: 0,
      walletCount: 0,
      chanCount: 0
    };
    guild.privilegedMembers = [];
    guild.privilegedMembers.push(this.userId);
    guild.adhesionRequest = [];

    Guilds.insert(guild);
  },

  joinGuild(guildId) {
    if (!this.userId) {                                   // log check
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to join a guild.');
    }

    check(guildId, String);
    const guild = Guilds.findOne(guildId)
    const user = Meteor.users.findOne(this.userId);
    if (!guild)
    {
      throw new Meteor.Error('does not exist',
        'There is no guild corresponding');
    } else if (_.contains(user.subscribedGuildes, guildId)) {
      throw new Meteor.Error('already joined',
        'Youve already joined this guild');
    }

    if (user) {
      Meteor.users.update(this.userId,
        { $push: { subscribedGuildes : guildId } },
        { $inc: {'connections.guildesCount' : 1} }
      );
    }
    else {
      throw new Meteor.Error('user-not-found',
        'User not found.');
    }

    Guilds.update(guildId, {
      $inc: {'connections.memberCount' : 1}
    });
  },

  joinChan(chanId) {
    if (!this.userId) {                                   // log check
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to join a chan.');
    }

    check(chanId, String);
    const chan = Chans.findOne(chanId)
    if (!chan)
    {
      throw new Meteor.Error('does not exist',
        'There is no chan corresponding');
    } else if (_.contains(user.subscribedChannels, chanId)) {
        throw new Meteor.Error('already joined',
          'Youve already joined this chan');
    }

    const user = Meteor.users.findOne(this.userId);
    if (user) {
      Meteor.users.update(this.userId,
        { $push: { subscribedChannels : guildId } },
        { $inc: {'connections.chansCount' : 1} }
      );
    }
    else {
      throw new Meteor.Error('user-not-found',
        'User not found.');
    }

    Chans.update(chanId, {
      $inc: {'connections.memberCount' : 1}
    });
  }

//   removeChan(chanId) {
//     if (!this.userId) {
//       throw new Meteor.Error('not-logged-in',
//         'Must be logged to remove a chat.');
//     }
//
//     check(chanId, String);
//
//     const chan = Chans.findOne(chanId);
//
//     if (!chan) {
//       throw new Meteor.Error('chan-not-exist',
//         'Chan does not exist');
//     }
//     if (!_.contains(chan.privilegedMembers, this.userId)) {
//       throw new Meteor.Error('not-allowed-to',
//       'Must have the right to do so.');
//     }
//
//     Messages.remove({ chanId: chanId });
//
//     Chans.remove({ _id: chanId });
//   }
});
