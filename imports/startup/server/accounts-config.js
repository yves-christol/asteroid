import { Accounts } from 'meteor/accounts-base';

Accounts.config({
  restrictCreationByEmailDomain: 'orange.com',
});

Accounts.onCreateUser((options, user) => {
  if (user && user.emails && user.emails[0] && user.emails[0].address) {
    let email = user.emails[0].address;
    user.username = email.substring(0, email.lastIndexOf("@")).replace('.', ' ');
  }
  // We still want the default hook's 'profile' behavior.
  if (options.profile) {
    user.profile = options.profile;
  }

  // Don't forget to return the new user object at the end!
  return user;
});
