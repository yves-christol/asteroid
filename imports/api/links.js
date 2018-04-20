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
  Meteor.publish('links', function (search, sortBy, order, limit) {
    let query      = {},
        projection = { limit, sort: { [sortBy]: order} };

    if ( search ) {
      let regex = new RegExp( search, 'i' );
      query = {
        $or: [
          { url: regex },
          { text: regex },
          { username: regex }
        ]
      };
    }
    return Links.find( query, projection );
  });
  // To get updated on number of links
  Meteor.publish('counters', function() {
    Counts.publish(this, 'nbLinks', Links.find());
  });
}

Meteor.methods({

  'links.insert'(url, text) {
    check(url, String);
    check(text, String);
    // Make sure the user is logged in
    if (!this.userId) {
      return;
    }
    // Then check if his email is verified
    const user = Meteor.users.findOne(this.userId);
    if (!user || !user.emails || !user.emails[0].verified) {
      if (Meteor.isClient) {
        alert("Please verify your email address before posting new links.");
      }
      return;
    }
    // if the same url is already in base just update it otherwise insert it
    link = Links.findOne({url: url});
    if (link) {
      Links.update(link._id, {
          $set: { text: text },
      });
    } else {
      Links.insert({
        url,
        text,
        createdAt: new Date(),
        owner: this.userId,
        username: user.username,
        hearts: 0,
      });
    }
  },

  'links.addHeart'(linkId) {
    check(linkId, String);
    // Make sure the user is logged in before changing ranking
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const link = Links.findOne(linkId);
    if (link) {
      let h = link.hearts;
      h += 1;
      if (h > 5) {
        h = 0;
      }
      Links.update(linkId, {
          $set: { hearts: h },
      });
    }
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

  'links.getText'(linkIds) {
    check(linkIds, Array);
    let text = '';
    for (const linkId of linkIds) {
      if (linkId) {
        const link = Links.findOne(linkId);
        if (link) {
          text = text + `${link.text} -> ${link.url}\n`
        }
      }
    }
    text = text + `\nGet more curated links on http://asteroid.eu.meteorapp.com\n`
    return text;
  }

});
