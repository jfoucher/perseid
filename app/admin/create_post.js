if(Meteor.isClient) {
    Template.create_post.rendered = function(){



    };



    Template.create_post.dragging = 0;

    Template.create_post.save_post = function(){
        var data = {
            "title" : $.trim($('#title').text()),
            "subtitle" : $.trim($('#subtitle').text()),
            "excerpt" : $.trim($('#post-excerpt').html()),
            "body" : $.trim($('#post-body').html()),
            "author": Meteor.user()._id,
            "date": Date.now(),
            "cover": $('.cover-image').css('backgroundImage'),
            "coverPosition": $('.cover-image').css('backgroundPosition'),
            "slug": $('#slug').val(),
            "status": $('[name="status"]:checked').val()
        };

        if($('#post-id').val()){
            Posts.update($('#post-id').val(), {$set:data});
        } else {
            data['status'] = 'draft';
            var id = Posts.insert(data);
            console.log('post created', id)
            Router.go('edit_post', {_id: id});
        }


    };

    Template.create_post.getCaretCharacterOffsetWithin = function(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        } else if ( (sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    };

    Template.create_post.genererateSlug = function(title){
        var slug = title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');

        return slug;
    };

    Template.create_post.events({

        'drop [contenteditable]': function(e){
            e.preventDefault();
        },
//        'focus #post-body': function(){
//            setTimeout(function(){
//                $('body').find('> *').animate({'opacity': '0'}, 2000);
//                $('#post-body').css({'opacity': '1 !important'});
//            },2000);
//        },
//        'blur #post-body': function(){
//            setTimeout(function(){
//                $('body').find('*').fadeIn();
//                $('#post-body').css({'opacity': '1 !important'});
//            },2000);
//        },
        'change .post-state': function(e) {
            var state = $('[name="status"]:checked').val();
            var btn = $('.post-meta-box').find('.btn-primary');
            console.log(state);
            if(state == 'publish') {
                btn.text('Publish post now');
            } else {
                btn.text('Save post as draft');
            }
        },

        'blur [contenteditable]': function(e){
            e.preventDefault();
        },
        'focusout [contenteditable]': function(e){
            e.preventDefault();
            //TODO Set post slug
            if(e.currentTarget.getAttribute('id') == 'title' && !$('#slug').val()) {
                $('#slug').val(Template.create_post.genererateSlug($(e.currentTarget).text()));
            }
            Template.create_post.save_post();
        },

        'click .toggle': function(e){
            $('.meta-box').toggleClass('open');
            $(e.currentTarget).toggleClass('glyphicon-plus glyphicon-remove');
        },
        'submit .meta-box > form': function(e){
            e.preventDefault();
            Template.create_post.save_post();
        }

    });



}

