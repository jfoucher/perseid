if(Meteor.isClient){
    Template.header.dragging = 0;
    Template.header.movingCover = 0;

    Template.header.helpers({
        'newPost': function(){
            return (!$('#post-id').val());
        },

        canEditPost: function(post){
            console.log(Meteor.user(), post, Router.current());
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
            console.log(e);
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
            console.log(e);
            var file = e.originalEvent.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function(){
                Meteor.call('saveFile', this.result, file.name, function(a,b,c){
                    console.log(a,b,c);
                    $('.cover-image').removeClass('upload');
                    $('.cover-image').css({
                        'background-image': 'url('+b+')',
                        'background-position':'center 0px'
                    }).addClass('has-image');
                    $('.dropzone').removeClass('active');
                    Template.create_post.save_post();
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

            console.log($('.cover-image').css('backgroundPosition'));
            Template.create_post.save_post();
        },
        'mouseout .cover-image': function(e){
            Template.header.dragging = 0;
            Template.header.movingCover = 0;
        }
    })
}