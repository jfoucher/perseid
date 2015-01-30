if(Meteor.isClient) {

    UI.registerHelper('dateFrom', function(date){
        return moment(date).fromNow();
    });

    UI.registerHelper('userAvatar', function(user, size){
        size = size || 128;
        if(user) {
            if(typeof user.profile !== 'undefined' && typeof user.profile.avatar !== 'undefined'){
                return '<img src="'+user.profile.avatar+'" width="'+size+'" />';
            } else if(typeof user.emails !== 'undefined'){
                var hash = CryptoJS.MD5(user.emails[0].address).toString();
                return '<img src="https://gravatar.com/avatar/'+hash+'?d=mm&s='+size+'" width="'+size+'" />';
            }
        }
        return '<img src="https://gravatar.com/avatar/'+hash+'?d=mm&s='+size+'" width="'+size+'" />';
    });

    UI.registerHelper('userName', function(user){
        if(user) {
            if(typeof user.profile !== 'undefined' && typeof user.profile.name !== 'undefined'){
                return user.profile.name;
            } else if(typeof user.emails !== 'undefined'){
                return user.emails[0].address;
            }
        }
        return '';
    });

    UI.registerHelper('authorName', function(post){
        var user = Meteor.users.findOne(post.author);
        if(user) {
            if(typeof user.profile !== 'undefined' && typeof user.profile.name !== 'undefined'){
                return user.profile.name;
            } else if(typeof user.emails !== 'undefined'){
                return user.emails[0].address;
            }
        }
        return '';
    });

    UI.registerHelper('isDraft', function(post){
        return (post && post.status && post.status == 'draft');
    });

    UI.registerHelper('blogOptions', function(which){
        var pref = Preferences.findOne(which);
        if(pref) {
            return pref.value;
        }
        return '';
    });

    UI.registerHelper('ifRouteIs', function (routeName) { return Router.current().route.name === routeName; });
}
