Router.map(function() {
    this.route('home', {
        path: '/',
        waitOn: function () {  // wait for the subscription to be ready; see below
            return Meteor.subscribe('posts');
        },
        data: function(){



            var posts = [];
            if(Meteor.user()){
                posts = Posts.find({$or:[{"author": Meteor.user()._id}, {"status": "publish"}]}, {sort:[['date', 'desc']]});
            } else {
                posts = Posts.find({"status": "publish"}, {sort:[['date', 'desc']]});
            }



            var blog = {
                title: Preferences.findOne('blog_title'),
                subtitle: Preferences.findOne('blog_subtitle'),
                cover: Preferences.findOne('blog_cover'),
                coverPosition: Preferences.findOne('blog_coverPosition'),
                showOnHome: Preferences.findOne('show_on_home')
            };

            console.log('blog options', blog);

            return {
                posts: posts,
                blog: blog
            }
        }
    });
    this.route('about');
    this.route('post', {
        path: '/posts/:_id',
        waitOn: function () {  // wait for the subscription to be ready; see below
            return Meteor.subscribe('posts');
        },
        data: function(){
            var params = this.params;
            console.log(params);
            var post;
            if(Meteor.user()) {
                post = Posts.findOne({"_id":this.params._id, $or:[{"status": 'publish'}, {"author": Meteor.user()._id}]});
            } else {
                post = Posts.findOne({"_id":this.params._id, "status": 'publish'});
            }

            var author = Meteor.users.findOne(post.author);

            return {
                post: post,
                author: author
            }
        },
        onAfterAction: function() {
            var post;
            // The SEO object is only available on the client.
            // Return if you define your routes on the server, too.
            if (!Meteor.isClient) {
                return;
            }
            post = this.data().post;
            SEO.set({
                title: post.title,
                meta: {
                    'description': post.excerpt
                },
                og: {
                    'title': post.title,
                    'description': post.excerpt,
                    'image': window.location.protocol+'//'+window.location.hostname +'/'+ post.cover
                }
            });
        }
    });

    this.route('create_post', {
        path: '/admin/create',
        isAdmin: true

    });
    this.route('preferences', {
        path: '/admin/preferences',
        waitOn: function () {  // wait for the subscription to be ready; see below
            return Meteor.subscribe('preferences');
        },
        data: function(){
            var d = {
                preferences: {
                    blog_title: Preferences.findOne({name:'blog_title'}),
                    blog_subtitle: Preferences.findOne({name:'blog_subtitle'})
                },
                isAdmin: true
            };
            console.log(d);
            return d;
        }

    });
    this.route('edit_post', {
        path: '/admin/edit/:_id',
        template: 'create_post',
        waitOn: function () {  // wait for the subscription to be ready; see below
            return Meteor.subscribe('posts');
        },
        data: function(){
            return {
                post: Posts.findOne({'author': Meteor.user()._id, '_id': this.params._id}),
                isAdmin: true
            };
        }

    });
    this.route('login', {
        path: '/login'
    })
});

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'not_found',
    loadingTemplate: 'loading'
});
Router.onBeforeAction('loading');
Router.onBeforeAction(function() {

    if (Meteor.loggingIn()) {
        this.render('loading');
        //pause();
    } else if (!Meteor.user()) {
        console.log('no user');
        Router.go('home');
        //pause();
    }
    //pause();

}, {only: ['admin', 'create_post', 'preferences']});