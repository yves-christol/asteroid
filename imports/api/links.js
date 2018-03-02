import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Links = new Mongo.Collection('links');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('links', function tasksPublication() {
    return Links.find();
  });
}

Meteor.methods({

  'links.insert'(url, text) {
    check(url, String);
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Links.insert({
      url,
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },

  'links.remove'(linkId) {
    check(linkId, String);
    const link = Links.findOne(linkId);
    if (link && link.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    Links.remove(linkId);
  },

  'links.setMarked'(linkId, setMarked) {
    check(linkId, String);
    check(setMarked, Boolean);

    Links.update(linkId, { $set: { marked: setMarked } });
  },
});
