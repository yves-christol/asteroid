import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Links = new Mongo.Collection('links');

if (Meteor.isServer) {
  // This is for improving search speed later on
  Links._ensureIndex({
    'url': 'text',
    'text': 'text',
    'username': 'text',
  })
  // This publication depends dynamically on the search query
  Meteor.publish('links', function (search) {
    let query      = {},
        projection = { limit: 100, sort: { title: 1 } };

    if ( search ) {
      let regex = new RegExp( search, 'i' );
      query = {
        $or: [
          { url: regex },
          { text: regex },
          { username: regex }
        ]
      };
      projection.limit = 100;
    }
    return Links.find( query, projection );
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

});
