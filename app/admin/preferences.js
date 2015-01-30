if(Meteor.isClient) {
    Template.preferences.helpers({
        'showOnHomeSelected': function(which){
            if (Preferences.findOne('show_on_home').value == which){
                return 'selected';
            }
            return '';

        }

    });
    Template.preferences.events({
        'submit #blog-preferences': function(e){
            e.preventDefault();

            var $el = $(e.currentTarget);

            $el.find('input, select').each(function(i, item){
                var $item = $(item);
                var id = $item.attr('id');
                Preferences.upsert(id, {$set:{value: $item.val()}});
            });

        },
        'click .toggle': function(e){
            $('.meta-box').toggleClass('open');
            $(e.currentTarget).toggleClass('glyphicon-plus glyphicon-remove');
        }

    });



}

