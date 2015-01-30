if(Meteor.isClient){
    Template.home.helpers({
        'homeDisplayIs': function(show){
            var showOnHome = Preferences.findOne('show_on_home');
            return (showOnHome && showOnHome.value == show);
        }
    });

    Template.blogpost.rendered = function(){
        $('.post-list').find('p').dotdotdot();
    };

    Template.blogpost.helpers({
        'showTools': function(post){
            var user = Meteor.users.findOne(post.author);
            return (Meteor.user() && user._id == Meteor.user()._id);
        },
        'trashed': function(){
            return (this.status == 'trash');
        }
    });

    Template.blogpost.events({
        'click a.delete': function(e){
            e.preventDefault();
            var id = this._id;
            Posts.update(id, {$set:{status: 'trash'}});

        },
        'click a.delete-forever': function(e){
            e.preventDefault();
            var id = this._id;
            var li = $(e.currentTarget).closest('li');
            li.addClass('removed');
            li.on('transitionend', function(){
                li.remove();
                Posts.remove(id);
            });


        },

        'click a.recover': function(e){
            e.preventDefault();
            var id = this._id;
            Posts.update(id, {$set:{status: 'draft'}});
        },
        'click a.publish': function(e){
            e.preventDefault();
            var id = this._id;
            Posts.update(id, {$set:{status: 'publish'}});
        },
        'click a.draft': function(e){
            e.preventDefault();
            var id = this._id;
            Posts.update(id, {$set:{status: 'draft'}});
        }
    })
}
