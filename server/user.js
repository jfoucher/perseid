if (Meteor.isServer) {
    Accounts.onCreateUser(function(options, user) {

        if (options.profile) {
            user.profile = options.profile;
        } else {
            user.profile = {};
        }
        var hash = CryptoJS.MD5(user.emails[0].address).toString();
        var size = 256;
        user.profile.name = user.emails[0].address.substr(0, user.emails[0].address.indexOf('@'));
        user.profile.avatar = 'https://gravatar.com/avatar/'+hash+'?d=mm&s='+size;

        return user;
    });
}
