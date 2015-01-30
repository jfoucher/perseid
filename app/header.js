if(Meteor.isClient){
    Template.header.dragging = 0;
    Template.header.movingCover = 0;

    Template.header.isEditingPost = function(){
        return ($('#post-id').length);
    };

    Template.header.helpers({
        'newPost': function(){
            return (!$('#post-id').val());
        },

        canEditPost: function(post){
            if(Router.current() && Router.current().route.name === 'home'){
                return false;
            }
            if(Meteor.user() && Router.current() && (Router.current().route.name === 'create_post' || Router.current().route.name === 'edit_post')) {
                if (post == null) {
                    return true;
                }
                return (post.author == Meteor.user()._id);
            }
            return false;

        }
    });
    Template.header.events({
        'dragover .dropzone': function(e){
            e.preventDefault();
        },
        'dragenter .dropzone': function(e){
            e.preventDefault();
            $(e.currentTarget).addClass('active');

        },
        'dragleave .dropzone': function(e){
            e.preventDefault();
            $(e.currentTarget).removeClass('active');
        },
        'drop .dropzone': function(e){
            e.preventDefault();
            var file = e.originalEvent.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function(){
                Meteor.call('saveFile', this.result, file.name, function(a,b,c){
                    $('.cover-image').removeClass('upload');
                    $('.cover-image').css({
                        'background-image': 'url('+b+')',
                        'background-position':'center 0px'
                    }).addClass('has-image');
                    $('.dropzone').removeClass('active');
                    if(Template.header.isEditingPost()) {
                        Template.create_post.save_post();
                    } else {
                        Preferences.upsert('blog_cover', {$set:{value: b}});
                    }

                });
            };

            reader.readAsBinaryString(file);

        },
        'mousedown .cover-image': function(e){
            Template.header.movingCover = 0;
            Template.header.dragging = 1;
            Template.header.mousePos = e.clientY;
            Template.header.origpos = parseInt($('.cover-image').css('backgroundPosition').split(" ")[1].replace('px', ''));
        },
        'mousemove .cover-image': function(e){
            Template.header.movingCover = 1;
            if(Template.header.dragging) {
                var newPos = e.clientY - Template.header.mousePos;
                var $cover = $('.cover-image');
                newPos = newPos + Template.header.origpos;
                if(newPos > 0) {
                    newPos = 0;
                }
                $cover.css('background-position', 'center '+newPos+'px');

            }
        },
        'mouseup .cover-image': function(e){
            Template.header.dragging = 0;

            //Save blog header position OR post header position
            if(Template.header.isEditingPost()) {
                Template.create_post.save_post();
            } else {
                Preferences.upsert('blog_coverPosition', {$set:{value: $('.cover-image').css('backgroundPosition')}});
            }
        },
        'mouseout .cover-image': function(e){
            Template.header.dragging = 0;
            Template.header.movingCover = 0;
        },
        'drop [contenteditable]': function(e){
            e.preventDefault();
        },
        'focusout [contenteditable]': function(e){
            e.preventDefault();
        },
        'blur [contenteditable]': function(e){
            e.preventDefault();
        },
        'blur #blog_title': function(e){
            e.preventDefault();
            Preferences.upsert('blog_title', {$set:{value: $('#blog_title').text()}});

        },
        'blur #blog_subtitle': function(e){
            e.preventDefault();

            Preferences.upsert('blog_subtitle', {$set:{value: $('#blog_subtitle').text()}});
        }
    })
}