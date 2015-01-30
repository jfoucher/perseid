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


            var showOnHome = Preferences.findOne('show_on_home');

            var data = {
                posts: posts

            };
            var post = null;
            if(showOnHome && showOnHome.value == 'single') {
                data['post'] = Posts.findOne({"status": "publish"}, {sort:[['date', 'desc']]});
                if(Meteor.user()){
                    data['posts'] = Posts.find({"author": Meteor.user()._id}, {sort:[['date', 'desc']]});
                }
                data['author'] = Meteor.users.findOne(data['post'].author);
            }

            return data;
        },
        onAfterAction: function() {
            var post;
            // The SEO object is only available on the client.
            // Return if you define your routes on the server, too.
            if (!Meteor.isClient) {
                return;
            }
            var blog = this.data().blog;
            SEO.set({
                title: blog.title.value,
                meta: {
                    'description': blog.subtitle.value
                },
                og: {
                    'title': blog.title.value,
                    'description': blog.subtitle.value,
                    'image': window.location.protocol+'//'+window.location.hostname +'/'+ blog.cover.value
                }
            });
        }
    });
    this.route('about');
    this.route('not_found', {
        data: function(){
            var showOnHome = Preferences.findOne('show_on_home');
            var blog = {
                title: Preferences.findOne('blog_title'),
                subtitle: Preferences.findOne('blog_subtitle'),
                cover: Preferences.findOne('blog_cover'),
                coverPosition: Preferences.findOne('blog_coverPosition'),
                showOnHome: showOnHome
            };
            return {
                blog: blog
            }
        }
    });
    this.route('post', {
        path: '/posts/:slug',
        waitOn: function () {  // wait for the subscription to be ready; see below
            return Meteor.subscribe('posts');
        },
        data: function(){
            var params = this.params;

            var post;
            if(Meteor.user()) {
                post = Posts.findOne({"slug":this.params.slug, $or:[{"status": 'publish'}, {"author": Meteor.user()._id}]});
            } else {
                post = Posts.findOne({"slug":this.params.slug, "status": 'publish'});
            }

            if(post == null) {

                Router.go('not_found');
                //show notfound template
            } else {
                var author = Meteor.users.findOne(post.author);

                return {
                    post: post,
                    author: author
                }
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
        isAdmin: true,
        onAfterAction: function() {
            var post;

            if (!Meteor.isClient) {
                return;
            }

            SEO.set({
                title: 'Write a new post'
            });
        }

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
                title: 'Editing post '+post.title
            });
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
    } else if (!Meteor.user()) {
        Router.go('home');
    }

}, {only: ['admin', 'create_post', 'preferences']});