if(Meteor.isClient){
    Template.home.helpers({
        'singleOnHome': function(show){
            return (show == 'single')
        }
    });

    Template.home.events({
        'drop [contenteditable]': function(e){
            e.preventDefault();
        },
        'blur #blog_title': function(e){
            e.preventDefault();
            var value = $('#blog_title').text();
            var s = {$set:{value: value.replace('&', '<span class="amp">&</span>')}};
            console.log(s);
//            var title = Preferences.findOne({name: 'blog_title'});
            Preferences.upsert('blog_title', s, {}, function(e, res){
                console.log('title', e, res);
            });

        },
        'blur #blog_subtitle': function(e){
            e.preventDefault();
            var v = $('#blog_subtitle').text();
            //$('#blog_subtitle').text('');
            var t = {$set:{value: v.replace('&', '<span class="amp">&</span>')}};
            console.log(t);
            Preferences.upsert('blog_subtitle', t, {}, function(e, res){
                console.log('subtitle', e, res);
            });
        },
        'focusout [contenteditable]': function(e){
            e.preventDefault();
        },
        'blur [contenteditable]': function(e){
            e.preventDefault();
        },
        'dragover .dropzone': function(e){
            e.preventDefault();
        },
        'dragenter .dropzone': function(e){
            console.log(e);
            e.preventDefault();
            $(e.currentTarget).addClass('active');

        },
        'dragleave .dropzone': function(e){
            e.preventDefault();
            console.log(e);
            $(e.currentTarget).removeClass('active');
        },
        'drop .dropzone': function(e){
            e.preventDefault();
            var file = e.originalEvent.dataTransfer.files[0];
            var reader = new FileReader();
            //TODO show/hide spinner
            reader.onload = function(){
                Meteor.call('saveFile', this.result, file.name, function(a,b){
                    $('.cover-image').removeClass('upload');
                    $('.cover-image').css({
                        'background-image': 'url('+b+')',
                        'background-position':'center 0px'
                    }).addClass('has-image');
                    $('.dropzone').removeClass('active');

                    Preferences.upsert('blog_cover', {$set:{value: 'url('+b+')'}});

                });
            };

            reader.readAsBinaryString(file);

        },
        'mousedown .cover-image': function(e){
            console.log('mouse down');
            Template.home.movingCover = 0;
            Template.home.dragging = 1;
            Template.home.mousePos = e.clientY;
            Template.home.origpos = parseInt($('.cover-image').css('backgroundPosition').split(" ")[1].replace('px', ''));
        },
        'mousemove .cover-image': function(e){
            Template.home.movingCover = 1;
            if(Template.home.dragging) {
                var newPos = e.clientY - Template.home.mousePos;
                var $cover = $('.cover-image');
                newPos = newPos + Template.home.origpos;
                if(newPos > 0) {
                    newPos = 0;
                }
                $cover.css('background-position', 'center '+newPos+'px');

            }
        },
        'mouseup .cover-image': function(e){
            Template.home.dragging = 0;
            Preferences.upsert('blog_coverPosition', {$set:{value: $('.cover-image').css('backgroundPosition')}});
            //console.log($('.cover-image').css('backgroundPosition'));
//            Template.home.save_post();
        },
        'mouseout .cover-image': function(e){
            Template.home.dragging = 0;
            Template.home.movingCover = 0;
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
            //console.log(this);
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
